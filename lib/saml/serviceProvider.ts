import { ServiceProvider } from "saml2-js";
import IConfiguration from "../configuration/IConfiguration";

export default function serviceProviderFromConfig(config: IConfiguration) {
  return new ServiceProvider({
    entity_id: `${config.baseUrl}/metadata.xml`,
    private_key: config.saml.privateKey,
    certificate: config.saml.cert,
    assert_endpoint: `${config.baseUrl}/assert`,
    allow_unencrypted_assertion: true,
  });
}
