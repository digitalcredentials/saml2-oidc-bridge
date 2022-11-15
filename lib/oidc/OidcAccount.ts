import { Account, FindAccount } from "oidc-provider";
import { v4 } from "uuid";

export default class OidcAccount implements Account {
  public accountId: string;
  [key: string]: unknown;

  constructor(id: string) {
    this.accountId = id || v4();
    // this.profile = profile;
    // store.set(this.accountId, this);
  }

  /**
   * @param use - can either be "id_token" or "userinfo", depending on
   *   where the specific claims are intended to be put in.
   * @param scope - the intended scope, while oidc-provider will mask
   *   claims depending on the scope automatically you might want to skip
   *   loading some claims from external resources etc. based on this detail
   *   or not return them in id tokens but only userinfo and so on.
   */
  async claims() {
    if (this.profile) {
      return {
        sub: this.accountId, // it is essential to always return a sub claim
        email: "exampleEmail@example.com",
        // email_verified: this.profile.email_verified,
        family_name: "Morgan",
        given_name: "Jackson",
        // locale: this.profile.locale,
        // name: this.profile.name,
      };
    }
    return {
      sub: this.accountId, // it is essential to always return a sub claim

      address: {
        country: "000",
        formatted: "000",
        locality: "000",
        postal_code: "000",
        region: "000",
        street_address: "000",
      },
      birthdate: "1987-10-16",
      email: "johndoe@example.com",
      email_verified: false,
      family_name: "Doe",
      gender: "male",
      given_name: "John",
      locale: "en-US",
      middle_name: "Middle",
      name: "John Doe",
      nickname: "Johny",
      phone_number: "+49 000 000000",
      phone_number_verified: false,
      picture: "http://lorempixel.com/400/200/",
      preferred_username: "johnny",
      profile: "https://johnswebsite.com",
      updated_at: 1454704946,
      website: "http://example.com",
      zoneinfo: "Europe/Berlin",
    };
  }

  // static async findByFederated(provider, claims) {
  //   const id = `${provider}.${claims.sub}`;
  //   if (!logins.get(id)) {
  //     logins.set(id, new Account(id, claims));
  //   }
  //   return logins.get(id);
  // }

  // static async findByLogin(login) {
  //   if (!logins.get(login)) {
  //     logins.set(login, new Account(login));
  //   }

  //   return logins.get(login);
  // }
}

export const findOidcAccount: FindAccount = (ctx, sub) => {
  return new OidcAccount(sub);
};
