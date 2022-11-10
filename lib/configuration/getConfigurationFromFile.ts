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
  config.clients = config.clients || [];
  config.samlIdps = config.samlIdps || [];

  await Promise.all([
    (async () => {
      config.samlPrivateKey = (
        await fs.readFile(pathUtil.join(baseDir, config.samlPrivateKey))
      ).toString();
    })(),
    (async () => {
      config.samlCert = (
        await fs.readFile(pathUtil.join(baseDir, config.samlCert))
      ).toString();
    })(),
    Promise.all(
      config.samlIdps.map(async (samlIdp) => {
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
