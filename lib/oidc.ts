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
