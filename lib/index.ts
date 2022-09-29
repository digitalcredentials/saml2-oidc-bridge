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

const oidc = new Provider("http://localhost:3000", configuration);

oidc.listen(3000, () => {
  console.log(
    "oidc-provider listening on port 3000, check http://localhost:3000/.well-known/openid-configuration"
  );
});
