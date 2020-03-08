const https = require("https");

module.exports = (address, options) => {
  return new Promise((resolve, reject) => {
    const req = https.request(address, options, res => {
      let body = "";
      res.on("data", chunk => {
        body += chunk.toString();
      });

      res.on("end", () => {
        resolve(JSON.parse(body));
      });
    });

    req.on("error", e => {
      reject(e);
    });

    req.end();
  });
};
