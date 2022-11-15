import { ClientMetadata, JWKS } from "oidc-provider";
import { IdentityProviderOptions } from "saml2-js";

export default interface IConfiguration {
  baseUrl: string;
  port: string;
  logFile?: string;
  saml: {
    privateKey: string;
    cert: string;
    idps: (IdentityProviderOptions & {
      name: string;
      displayName: string;
    })[];
  };
  oidc: {
    clients: (ClientMetadata & { allowedOrigins: string[] })[];
    cookieKeys: string[];
    jwks: JWKS;
  };
}
