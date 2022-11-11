import { Response } from "express";
import { Provider } from "oidc-provider";

type Interaction = InstanceType<Provider["Interaction"]>;

export default async function preLoginHandler(
  interaction: Interaction,
  res: Response
): Promise<void> {
  
}
