import { Account, FindAccount } from "oidc-provider";
import { v4 } from "uuid";
import { IOidcClaims } from "../util/samlResultToOidcClaim";
import { getAccountClaims } from "./redisOidcAdapter";

export default class OidcAccount implements Account {
  public accountId: string;
  private oidcClaims: IOidcClaims;
  [key: string]: unknown;

  constructor(id: string, claims: IOidcClaims) {
    this.accountId = id || v4();
    this.oidcClaims = claims;
  }

  async claims() {
    return {
      ...this.oidcClaims,
      sub: this.accountId,
    };
  }
}

export const findOidcAccount: FindAccount = async (ctx, sub) => {
  const accountClaims = await getAccountClaims(sub);
  return new OidcAccount(sub, accountClaims || {});
};
