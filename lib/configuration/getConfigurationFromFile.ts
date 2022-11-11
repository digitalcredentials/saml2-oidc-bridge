import fs from "fs-extra";
import pathUtil from "path";
import IConfiguration from "./IConfiguration";

export default async function getConfigurationFromFile(
  path: string
): Promise<IConfiguration> {
  const config: IConfiguration = JSON.parse(
    (await fs.readFile(path)).toString()
  ) as IConfiguration;

  const baseDir = pathUtil.dirname(path);

  config.baseUrl = config.baseUrl || "http://localhost:3000";
  config.port = config.port || "3000";
  config.oidc.clients = config.oidc.clients || [];
  config.saml.idps = config.saml.idps || [];

  await Promise.all([
    (async () => {
      config.saml.privateKey = (
        await fs.readFile(pathUtil.join(baseDir, config.saml.privateKey))
      ).toString();
    })(),
    (async () => {
      config.saml.cert = (
        await fs.readFile(pathUtil.join(baseDir, config.saml.cert))
      ).toString();
    })(),
    (async () => {
      config.oidc.jwks = JSON.parse(
        (
          await fs.readFile(
            pathUtil.join(baseDir, config.oidc.jwks as unknown as string)
          )
        ).toString()
      );
    })(),
    Promise.all(
      config.saml.idps.map(async (samlIdp) => {
        samlIdp.certificates = Array.isArray(samlIdp.certificates)
          ? samlIdp.certificates
          : [samlIdp.certificates];
        samlIdp.certificates = await Promise.all(
          samlIdp.certificates.map(async (certPath) => {
            return (
              await fs.readFile(pathUtil.join(baseDir, certPath))
            ).toString();
          })
        );
      })
    ),
  ]);

  return config;
}
