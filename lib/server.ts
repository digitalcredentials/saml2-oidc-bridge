import getConfigurationFromFile from "./configuration/getConfigurationFromFile";

interface StartServerOptions {
  config: string;
}

export async function startServer(inputOptions: StartServerOptions) {
  console.log(inputOptions.config);
  const config = await getConfigurationFromFile(inputOptions.config);
  console.log(JSON.stringify(config, null, 2));
}