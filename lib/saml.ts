import saml2 from "saml2-js";
import fs from "fs";
import express from "express";

const IP = "https://saml.dcconsortium.org"

const app = express();
// If you're using express <4.0:
// var bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({
//   extended: true
// }));
app.use(express.urlencoded());

// Create service provider
const sp_options = {
  entity_id: `${IP}/metadata.xml`,
  private_key: fs.readFileSync("key-file.pem").toString(),
  certificate: fs.readFileSync("cert-file.crt").toString(),
  assert_endpoint: `${IP}/assert`,
  allow_unencrypted_assertion: true
};
const sp = new saml2.ServiceProvider(sp_options);

// Create identity provider
const idp_options = {
  sso_login_url: "https://login.microsoftonline.com/7e153a68-2c14-45b5-aabd-890731981795/saml2",
  sso_logout_url: "https://login.microsoftonline.com/7e153a68-2c14-45b5-aabd-890731981795/saml2",
  certificates: [fs.readFileSync("idp-cert.crt").toString()],
};
const idp = new saml2.IdentityProvider(idp_options);

// ------ Define express endpoints ------

// Endpoint to retrieve metadata
app.get("/metadata.xml", function (req, res) {
  res.type("application/xml");
  res.send(sp.create_metadata());
});

// Starting point for login
app.get("/login", function (req, res) {
  sp.create_login_request_url(idp, {}, function (err, login_url, request_id) {
    if (err != null) return res.send(500);
    res.redirect(login_url);
  });
});

// Variables used in login/logout process
let name_id: string;
let session_index: string | undefined;

// Assert endpoint for when login completes
app.post("/assert", function (req, res) {
  const options = { request_body: req.body };
  console.log(options);
  sp.post_assert(idp, options, function (err, saml_response) {
    console.log(err);
    if (err != null) return res.send(500);

    // Save name_id and session_index for logout
    // Note:  In practice these should be saved in the user session, not globally.
    name_id = saml_response.user.name_id;
    session_index = saml_response.user.session_index;

    res.send(`Hello ${name_id}! session_index: ${session_index}.`);
  });
});

// Starting point for logout
app.get("/logout", function (req, res) {
  const options = {
    name_id: name_id,
    session_index: session_index,
  };

  sp.create_logout_request_url(idp, options, function (err, logout_url) {
    if (err != null) return res.send(500);
    res.redirect(logout_url);
  });
});

app.listen(3000, () => {
  console.log("Listening on 3000");
});
