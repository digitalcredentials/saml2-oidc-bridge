import { KoaContextWithOIDC } from "oidc-provider";

export async function loadExistingGrant(ctx: KoaContextWithOIDC) {
  if (!ctx.oidc.client?.clientId) {
    return undefined;
  }

  const grantId =
    (ctx.oidc.result &&
      ctx.oidc.result.consent &&
      ctx.oidc.result.consent.grantId) ||
    ctx.oidc.session?.grantIdFor(ctx.oidc.client.clientId);

  if (grantId) {
    return ctx.oidc.provider.Grant.find(grantId);
  }

  const grant = new ctx.oidc.provider.Grant({
    clientId: ctx.oidc.client.clientId,
    accountId: ctx.oidc.session?.accountId,
  });

  const scopes = (ctx.oidc.params?.scope as string)?.split(" ") || "";

  scopes.forEach((scope) => {
    grant.addOIDCScope(scope);
  });

  // TODO: Use ttl.Grant
  await grant.save(3600);

  return grant;
}
