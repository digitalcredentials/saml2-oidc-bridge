import { Provider } from "oidc-provider";
import IConfiguration from "./configuration/IConfiguration";

export default function createOidcProvider(config: IConfiguration) {
  return new Provider(config.baseUrl, {
    clients: config.oidc.clients,
    interactions: {
      url(ctx, interactions) {
        return `/interaction/${interactions.uid}`;
      },
    },
    cookies: {
      keys: config.oidc.cookieKeys,
    },
    features: {
      devInteractions: { enabled: false },
      deviceFlow: { enabled: true },
      revocation: { enabled: true },
    },
    jwks: config.oidc.jwks,
    extraParams: ["provider"],
  });
}
