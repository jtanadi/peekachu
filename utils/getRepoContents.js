const { api, authHeader } = require("./githubAPI");
const buildTree = require("./buildTree");
const request = require("./request");

module.exports = async repo => {
  try {
    const commits = await request(api + `/${repo}/commits`, {
      headers: authHeader
    });
    const commitSHA = commits[0].sha;

    const { tree } = await request(
      api + `/${repo}/git/trees/${commitSHA}?recursive=true`,
      {
        headers: authHeader
      }
    );

    return tree.reduce((accum, _tree) => {
      // Disregard directories and hidden files
      if (_tree.type !== "blob" || _tree.path.startsWith(".")) return accum;

      let path = _tree.path.split("/");
      return buildTree(accum, path);
    }, {});
  } catch (e) {
    console.log(e);
  }
};
