import { Request, Response } from "express";
import IContext from "../configuration/IContext";
import { Interaction } from "../util/InteractionType";

export default async function preLoginHandler(
  req: Request,
  res: Response,
  interaction: Interaction,
  context: IContext
): Promise<void> {
  if (!interaction.params.provider) {
    await sendIdpSelectionUi(interaction, res, context);
  } else {
    await beginSamlLogin(
      interaction.params.provider as string,
      req,
      res,
      interaction,
      context
    );
  }
}

async function sendIdpSelectionUi(
  interaction: Interaction,
  res: Response,
  context: IContext
) {
  res.render("select-idp", {
    idps: context.config.saml.idps,
    uid: interaction.uid,
  });
}

export async function beginSamlLogin(
  idpName: string,
  req: Request,
  res: Response,
  interaction: Interaction,
  context: IContext
) {
  // Get the selected IDP
  const idp = context.samlIdps[idpName];
  if (!idp) {
    throw new Error(`IDP "${idpName}" is not an available IDP.`);
  }

  // Save the selected IDP to the current session for use after the redirect
  req.session.idpName = idpName;

  // SAML redirect
  await new Promise<void>((resolve, reject) => {
    context.serviceProvider.create_login_request_url(
      idp,
      {
        relay_state: interaction.uid,
      },
      (err, loginUrl) => {
        if (err) reject(err);
        res.redirect(loginUrl);
        resolve();
      }
    );
  });
}
