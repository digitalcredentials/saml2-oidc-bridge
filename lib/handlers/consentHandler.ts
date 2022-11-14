import { Request, Response } from "express";
import { InteractionResults, Provider } from "oidc-provider";
import IContext from "../configuration/IContext";
import { Interaction } from "../util/InteractionType";

export async function renderConsentUi(res: Response, interaction: Interaction) {
  res.render("consent", { uid: interaction.uid });
}

export async function consentHandler(
  req: Request,
  res: Response,
  context: IContext
) {
  const interactionDetails = await context.provider.interactionDetails(
    req,
    res
  );
  const {
    prompt: { name, details },
    params,
    session,
  } = interactionDetails;
  if (name !== "consent") {
    throw new Error(
      "Consent Handler can only be called with the consent prompt"
    );
  }
  const accountId = session?.accountId as string;

  let { grantId } = interactionDetails;
  let grant: InstanceType<Provider["Grant"]>;

  if (grantId) {
    // we'll be modifying existing grant in existing session
    grant = (await context.provider.Grant.find(grantId)) as InstanceType<
      Provider["Grant"]
    >;
  } else {
    // we're establishing a new grant
    grant = new context.provider.Grant({
      accountId,
      clientId: params.client_id as string,
    });
  }

  if (details.missingOIDCScope) {
    grant.addOIDCScope((details.missingOIDCScope as string[]).join(" "));
  }
  if (details.missingOIDCClaims) {
    grant.addOIDCClaims(details.missingOIDCClaims as string[]);
  }
  if (details.missingResourceScopes) {
    // eslint-disable-next-line no-restricted-syntax
    for (const [indicator, scopes] of Object.entries(
      details.missingResourceScopes
    )) {
      grant.addResourceScope(indicator, scopes.join(" "));
    }
  }

  grantId = await grant.save();

  const consent: InteractionResults["consent"] = {};
  if (!interactionDetails.grantId) {
    // we don't have to pass grantId to consent, we're just modifying existing one
    consent.grantId = grantId;
  }

  const result: InteractionResults = { consent };
  await context.provider.interactionFinished(req, res, result, {
    mergeWithLastSubmission: true,
  });
}
