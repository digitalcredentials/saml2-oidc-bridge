import { Express, NextFunction, Request, Response } from "express";
import { Provider } from "oidc-provider";
import preLoginHandler from "./handlers/preLoginHandler";

function setNoCache(req: Request, res: Response, next: NextFunction) {
  res.set("cache-control", "no-store");
  next();
}

export default async function routes(
  app: Express,
  provider: Provider
): Promise<void> {
  app.get("/interaction/:uid", setNoCache, async (req, res, next) => {
    const interaction = await provider.interactionDetails(req, res);
    console.log(JSON.stringify(interaction, null, 2));

    // const client = await provider.Client.find(
    //   interaction.params.client_id as string
    // );

    switch (interaction.prompt.name) {
      case "login": {
        await preLoginHandler(interaction, res);
      }
      // case "consent": {
      //   return res.render("interaction", {
      //     client,
      //     uid,
      //     details: prompt.details,
      //     params,
      //     title: "Authorize",
      //     // session: session ? debug(session) : undefined,
      //     // dbg: {
      //     //   params: debug(params),
      //     //   prompt: debug(prompt),
      //     // },
      //   });
      // }
      default:
        return undefined;
    }
  });

  // app.post(
  //   "/interaction/:uid/login",
  //   setNoCache,
  //   body,
  //   async (req, res, next) => {
  //     try {
  //       const {
  //         prompt: { name },
  //       } = await provider.interactionDetails(req, res);
  //       assert.equal(name, "login");
  //       const account = await Account.findByLogin(req.body.login);

  //       const result = {
  //         login: {
  //           accountId: account.accountId,
  //         },
  //       };

  //       await provider.interactionFinished(req, res, result, {
  //         mergeWithLastSubmission: false,
  //       });
  //     } catch (err) {
  //       next(err);
  //     }
  //   }
  // );
}
