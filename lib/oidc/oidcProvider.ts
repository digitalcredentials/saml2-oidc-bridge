import { Provider } from "oidc-provider";
import IConfiguration from "../configuration/IConfiguration";
import { findOidcAccount } from "./OidcAccount";
import RedisAdapter from "./redisOidcAdapter";

export default function createOidcProvider(config: IConfiguration) {
  const provider = new Provider(config.baseUrl, {
    findAccount: findOidcAccount,
    adapter: RedisAdapter,
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
  provider.proxy = true;
  return provider;
}
