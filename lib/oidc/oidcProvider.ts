import { Provider, interactionPolicy } from "oidc-provider";
import IConfiguration from "../configuration/IConfiguration";
import { findOidcAccount } from "./OidcAccount";
import RedisAdapter from "./redisOidcAdapter";
import { loadExistingGrant } from "./loadExistingGrant";

export default function createOidcProvider(config: IConfiguration) {
  const clientOrigins: Record<string, Set<string>> = {};
  config.oidc.clients.forEach((clientConfig) => {
    clientOrigins[clientConfig.client_id] = new Set<string>();
    (clientConfig.allowedOrigins || []).forEach((origin) => {
      clientOrigins[clientConfig.client_id].add(origin);
    });
  });

  const provider = new Provider(config.baseUrl, {
    findAccount: findOidcAccount,
    adapter: RedisAdapter,
    clients: config.oidc.clients,
    interactions: {
      url(ctx, interactions) {
        return `/interaction/${interactions.uid}`;
      },
      policy: [
        new interactionPolicy.Prompt(
          { name: "login", requestable: true },
          new interactionPolicy.Check(
            "saml_login_required",
            "SAML Login is required",
            (ctx) => {
              return !ctx.oidc.result?.login?.accountId;
            }
          )
        ),
      ],
    },
    clientBasedCORS(ctx, origin, client) {
      return clientOrigins[client.clientId].has(origin);
    },
    loadExistingGrant,
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
    claims: {
      profile: ["email", "family_name", "given_name"],
    },
    conformIdTokenClaims: false,
  });
  provider.proxy = true;
  return provider;
}
