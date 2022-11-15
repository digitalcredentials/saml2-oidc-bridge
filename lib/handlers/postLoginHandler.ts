import { Request, Response } from "express";
import IContext from "../configuration/IContext";
import { setAccountClaims } from "../oidc/redisOidcAdapter";
import samlToOidcClaim from "../util/samlResultToOidcClaim";

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

        req.session.samlLogin = {
          nameId,
          sessionIndex,
          shouldHandleOidcRedirect: true,
          claims: samlToOidcClaim(saml_response.user),
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
  const accountId = `${req.session.idpName}:${req.session.samlLogin.nameId}`;
  await Promise.all([
    setAccountClaims(accountId, req.session.samlLogin.claims || {}),
    context.provider.interactionFinished(
      req,
      res,
      {
        login: {
          accountId: accountId,
        },
      },
      { mergeWithLastSubmission: false }
    ),
  ]);
}
