<<<<<<< HEAD
#!/usr/bin/env node

import { program } from "commander";
import { startServer } from "./server";

program
  .name("saml2-oidc-bridge")
  .description("A server that connects OIDC applications to saml IDPs")
  .version("1.0.4");

program
  .command("start")
  .description("Start the server")
  .option("-c, --config <config>", "Provide the input path")
  .action(startServer);

program.parse();
=======
import { Provider } from "oidc-provider";
const configuration = {
  // ... see /docs for available configuration
  clients: [
    {
      client_id: "foo",
      client_secret: "bar",
      redirect_uris: ["https://oidcdebugger.com/debug"],
    },
  ],
};

const oidc = new Provider("http://3.95.136.185", configuration);

oidc.listen(80, () => {
  console.log(
    "oidc-provider listening on port 80, check http://localhost:3000/.well-known/openid-configuration"
  );
});
>>>>>>> 6d678c3 (initial oidc work)
