import { ClientMetadata } from "oidc-provider";
import { IdentityProviderOptions } from "saml2-js";

export default interface IConfiguration {
  baseUrl: string;
  port: string;
  samlPrivateKey: string;
  samlCert: string;
  clients: ClientMetadata[];
  samlIdps: (IdentityProviderOptions & {
    name: string;
    displayName: string;
  })[];
}
