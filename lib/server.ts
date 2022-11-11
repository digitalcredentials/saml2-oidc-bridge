import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import getConfigurationFromFile from "./configuration/getConfigurationFromFile";
import createOidcProvider from "./oidcProvider";
import routes from "./routes";
import logger from "./util/logger";

interface StartServerOptions {
  config: string;
}

export async function startServer(inputOptions: StartServerOptions) {
  const app = express();
  const config = await getConfigurationFromFile(inputOptions.config);
  const provider = createOidcProvider(config);

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

  routes(app, provider, config);
  app.use(provider.callback());

  app.listen(config.port, () => {
    console.log(
      `saml2-oidc-bridge is listening on ${config.port}. Open ${config.baseUrl}/.well-known/openid-configuration`
    );
  });
}
