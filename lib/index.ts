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
