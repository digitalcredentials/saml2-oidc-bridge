import "express-session";

declare module "express-session" {
  interface SessionData {
    idpName?: string;
  }
}
