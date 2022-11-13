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

  // Perform an asserv
  const options = { request_body: req.body };
  context.serviceProvider.post_assert(
    idp,
    options,
    function (err, saml_response) {
      console.log(err);
      if (err != null) throw err;

      const nameId = saml_response.user.name_id;
      const sessionIndex = saml_response.user.session_index;

      res.send(`Hello ${nameId}! session_index: ${sessionIndex}.`);
    }
  );
}
