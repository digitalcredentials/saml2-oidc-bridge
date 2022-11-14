import "express-session";

declare module "express-session" {
  interface SessionData {
    idpName?: string;
    samlLogin: {
      shouldHandleOidcRedirect: boolean;
      nameId: string;
      sessionIndex?: string;
    };
  }
}
