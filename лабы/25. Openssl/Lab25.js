const https = require("https");
const fs = require("fs");

const options = {
  passphrase: "maxicids",
  key: fs.readFileSync("openssl/RECOURSE.key").toString(),
  cert: fs.readFileSync("openssl/RECOURSE.crt").toString(),
};
  const server = https.createServer(options, (req, res) => {
    const date = new Date();
    res.end(`Lab25 ${date.toLocaleString()}`);
  });
  server.listen(8443, () => {
    console.log('Server listen on port 8443');
  });


