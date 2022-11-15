import "express-session";
import { IOidcClaims } from "../util/samlResultToOidcClaim";

declare module "express-session" {
  interface SessionData {
    idpName?: string;
    samlLogin: {
      shouldHandleOidcRedirect: boolean;
      nameId: string;
      sessionIndex?: string;
      claims: IOidcClaims;
    };
  }
}
