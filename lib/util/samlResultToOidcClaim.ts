import { SAMLAssertResponse } from "saml2-js";

export type IOidcClaims = Partial<{
  address: string;
  email: string;
  email_verified: string;
  phone_number: string;
  phone_number_verified: string;
  birthdate: string;
  family_name: string;
  gender: string;
  given_name: string;
  locale: string;
  middle_name: string;
  name: string;
  nickname: string;
  picture: string;
  preferred_username: string;
  profile: string;
  updated_at: string;
  website: string;
  zoneinfo: string;
}>;

const samlToOidcClaimMap: Record<
  keyof SAMLAssertResponse["user"],
  keyof IOidcClaims | undefined
> = {
  name_id: undefined,
  email: "email",
  given_name: "given_name",
  name: "name",
  upn: "email",
  common_name: "nickname",
  group: undefined,
  role: undefined,
  surname: "family_name",
  ppid: undefined,
  authentication_method: undefined,
  deny_only_group_sid: undefined,
  deny_only_primary_sid: undefined,
  deny_only_primary_group_sid: undefined,
  group_sid: undefined,
  primary_group_sid: undefined,
  primary_sid: undefined,
  windows_account_name: undefined,
  session_index: undefined,
  session_not_on_or_after: undefined,
  attributes: undefined,
};

export default function samlToOidcClaim(
  samlUser: SAMLAssertResponse["user"]
): IOidcClaims {
  const oidcClaims: IOidcClaims = {};
  Object.keys(samlUser).forEach((key) => {
    const samlUserKey = key as keyof SAMLAssertResponse["user"];
    const oidcClaimName = samlToOidcClaimMap[samlUserKey] as
      | keyof IOidcClaims
      | undefined;
    if (oidcClaimName) {
      oidcClaims[oidcClaimName] = samlUser[samlUserKey] as string;
    }
  });
  return oidcClaims;
}
