import { Provider } from "oidc-provider";
import { IdentityProvider, ServiceProvider } from "saml2-js";
import IConfiguration from "./IConfiguration";

export default interface IContext {
  config: IConfiguration;
  provider: Provider;
  serviceProvider: ServiceProvider;
  samlIdps: Record<string, IdentityProvider>;
}
