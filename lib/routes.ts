import { urlencoded, Express, NextFunction, Request, Response } from "express";
import IContext from "./configuration/IContext";
import postLoginHandler from "./handlers/postLoginHandler";
import preLoginHandler, { beginSamlLogin } from "./handlers/preLoginHandler";

const body = urlencoded({ extended: false });

function setNoCache(req: Request, res: Response, next: NextFunction) {
  res.set("cache-control", "no-store");
  next();
}

export default async function routes(
  app: Express,
  context: IContext
): Promise<void> {
  app.get("/interaction/:uid", setNoCache, async (req, res) => {
    const interaction = await context.provider.interactionDetails(req, res);
    switch (interaction.prompt.name) {
      case "login": {
        await preLoginHandler(req, res, interaction, context);
      }
      default:
        return undefined;
    }
  });

  app.post(
    "/interaction/:uid/select-idp",
    setNoCache,
    body,
    async (req, res) => {
      const interaction = await context.provider.interactionDetails(req, res);
      const idpName = req.body.idp;
      await beginSamlLogin(idpName, req, res, interaction, context);
    }
  );

  app.post("/assert", body, async (req, res) => {
    await postLoginHandler(req, res, context);
  });

  app.get("/metadata.xml", function (req, res) {
    res.type("application/xml");
    res.send(context.serviceProvider.create_metadata());
  });
}
