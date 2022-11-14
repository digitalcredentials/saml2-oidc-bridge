import { Request, Response } from "express";
import IContext from "../configuration/IContext";

export default async function postLoginHandler(
  req: Request,
  res: Response,
  context: IContext
): Promise<void> {
  // Get the current IDP from the session
  if (!req.session.idpName) throw new Error(`Could not find IDP name.`);
  const idp = context.samlIdps[req.session.idpName];
  if (!idp) {
    throw new Error(`Could not find IDP by the name "${req.session.idpName}"`);
  }

  const uid = req.body.RelayState;
  if (!uid) {
    throw new Error("Could not find the OIDC session UID.");
  }

  // Perform an asserv
  const options = { request_body: req.body };
  return new Promise<void>((resolve) => {
    context.serviceProvider.post_assert(
      idp,
      options,
      async (err, saml_response) => {
        // Finish the interaction with an error if there is an error
        if (err != null) {
          await context.provider.interactionFinished(req, res, {
            error: "access_denied",
            error_description: err.message,
          });
          resolve();
          return;
        }

        const nameId = saml_response.user.name_id;
        const sessionIndex = saml_response.user.session_index;
        console.log(saml_response.user);
        req.session.samlLogin = {
          nameId,
          sessionIndex,
          shouldHandleOidcRedirect: true,
        };

        res.redirect(`/interaction/${uid}/login`);
        resolve();
      }
    );
  });
}

export async function loginHandler(
  req: Request,
  res: Response,
  context: IContext
): Promise<void> {
  console.log("before");
  const interaction = await context.provider.interactionDetails(req, res);
  console.log("after");
  console.log(interaction.session);
  if (
    !req.session.samlLogin ||
    !req.session.samlLogin.shouldHandleOidcRedirect
  ) {
    throw new Error(
      "Login route can only be called directly after the assert route"
    );
  }
  if (!req.session.idpName) {
    throw new Error("Must have an idp name to log in");
  }
  req.session.samlLogin.shouldHandleOidcRedirect = false;
  await context.provider.interactionFinished(
    req,
    res,
    {
      accountId: req.session.samlLogin.nameId,
    },
    { mergeWithLastSubmission: false }
  );
}
