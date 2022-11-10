<<<<<<< HEAD
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
=======
#!/usr/bin/env node
>>>>>>> 500f651 (Configuration loading)

import { program } from "commander";
import { startServer } from "./server";

<<<<<<< HEAD
oidc.listen(80, () => {
  console.log(
    "oidc-provider listening on port 80, check http://localhost:3000/.well-known/openid-configuration"
  );
});
>>>>>>> 6d678c3 (initial oidc work)
=======
program
  .name("saml2-oidc-bridge")
  .description("A server that connects OIDC applications to saml IDPs")
  .version("0.0.1");

program
  .command("start")
  .description("Start the server")
  .option("-c, --config <config>", "Provide the input path")
  .action(startServer);

program.parse();
>>>>>>> 500f651 (Configuration loading)
