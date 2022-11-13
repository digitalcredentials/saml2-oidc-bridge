import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import session from "express-session";
import createContext from "./configuration/createContext";
import getConfigurationFromFile from "./configuration/getConfigurationFromFile";
import routes from "./routes";
import logger from "./util/logger";

interface StartServerOptions {
  config: string;
}

export async function startServer(inputOptions: StartServerOptions) {
  const app = express();
  const config = await getConfigurationFromFile(inputOptions.config);
  const context = createContext(config);

  app.enable("trust proxy");

  // Set up server
  const directives = helmet.contentSecurityPolicy.getDefaultDirectives();
  delete directives["form-action"];
  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: false,
        directives,
      },
    })
  );

  app.use(
    session({
      proxy: true,
      secret: context.config.oidc.cookieKeys,
      resave: false,
      saveUninitialized: true,
      cookie: { secure: true },
    })
  );

  app.set("views", path.join(__dirname, "../views"));
  app.set("view engine", "ejs");

  const morganMiddleware = morgan(
    ":method :url :status :res[content-length] - :response-time ms",
    {
      stream: {
        write: (message) => logger.http(message.trim()),
      },
    }
  );
  app.use(morganMiddleware);

  routes(app, context);
  app.use(context.provider.callback());

  app.listen(config.port, () => {
    console.log(
      `saml2-oidc-bridge is listening on ${config.port}. Open ${config.baseUrl}/.well-known/openid-configuration`
    );
  });
}
