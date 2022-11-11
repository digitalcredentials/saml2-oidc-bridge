import { Response } from "express";
import { Provider } from "oidc-provider";
import { IdentityProvider } from "saml2-js";
import IConfiguration from "../configuration/IConfiguration";
import serviceProviderFromConfig from "../saml/serviceProvider";

type Interaction = InstanceType<Provider["Interaction"]>;

export default async function preLoginHandler(
  interaction: Interaction,
  res: Response,
  config: IConfiguration
): Promise<void> {
  if (!interaction.params.provider) {
    await sendIdpSelectionUi(interaction, res, config);
  } else {
    await beginSamlLogin(interaction.params.provider as string, res, config);
  }
}

async function sendIdpSelectionUi(
  interaction: Interaction,
  res: Response,
  config: IConfiguration
) {
  res.render("select-idp", {
    idps: config.saml.idps,
    uid: interaction.uid,
  });
}

export async function beginSamlLogin(
  idpName: string,
  res: Response,
  config: IConfiguration
) {
  const idpConfig = config.saml.idps.find((idp) => idp.name === idpName);
  if (!idpConfig) {
    throw new Error(`IDP "${idpName}" is not an available IDP.`);
  }
  const serviceProvider = serviceProviderFromConfig(config);
  const idp = new IdentityProvider(idpConfig);
  await new Promise<void>((resolve, reject) => {
    serviceProvider.create_login_request_url(idp, {}, (err, loginUrl) => {
      if (err) reject(err);
      res.redirect(loginUrl);
      resolve();
    });
  });
}
