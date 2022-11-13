import { IdentityProvider } from "saml2-js";
import createOidcProvider from "../oidc/oidcProvider";
import serviceProviderFromConfig from "../saml/serviceProvider";
import IConfiguration from "./IConfiguration";
import IContext from "./IContext";

export default function createContext(config: IConfiguration): IContext {
  const provider = createOidcProvider(config);
  const serviceProvider = serviceProviderFromConfig(config);
  const samlIdps = config.saml.idps.reduce<Record<string, IdentityProvider>>(
    (agg, idpConfig) => {
      agg[idpConfig.name] = new IdentityProvider(idpConfig);
      return agg;
    },
    {}
  );

  return {
    config,
    provider,
    serviceProvider,
    samlIdps,
  };
}
