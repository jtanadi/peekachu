const https = require("https");
const { owner, repo, api, authHeader } = require("./githubAPI");

const request = (address, options) => {
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

module.exports = async () => {
  try {
    const commits = await request(api + "/commits", { headers: authHeader });
    const commitSHA = commits[0].sha;

    const { tree } = await request(
      api + `/git/trees/${commitSHA}?recursive=true`,
      {
        headers: authHeader
      }
    );

    return tree.reduce((acc, _tree) => {
      // Disregard directories and hidden files
      if (_tree.type !== "blob" || _tree.path[0] === ".") return acc;
      let [dir, filename] = _tree.path.split("/");

      // Root files look like [file, null] after splitting
      if (!filename) {
        filename = dir;
        dir = "root";
      }

      if (!acc[dir]) {
        acc[dir] = [filename];
      } else {
        acc[dir] = [...acc[dir], filename];
      }
      return acc;
    }, {});
  } catch (e) {
    console.log(e);
  }
};
