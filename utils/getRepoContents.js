const { api, authHeader } = require("./githubAPI");
const buildTree = require("./buildTree");
const makeError = require("./makeError");
const request = require("./request");

module.exports = async repo => {
  const commits = await request(api + `/${repo}/commits`, {
    headers: authHeader
  });

  if (!commits[0]) {
    throw makeError(404, `No commits found in repo '${repo}'.`);
  }

  const commitSHA = commits[0].sha;

  const { tree } = await request(
    api + `/${repo}/git/trees/${commitSHA}?recursive=true`,
    {
      headers: authHeader
    }
  );

  if (!tree) {
    throw makeError(500, `Problem getting tree in repo ${repo}`);
  }

  return tree.reduce((accum, _tree) => {
    // Disregard directories and hidden files
    if (_tree.type !== "blob" || _tree.path.startsWith(".")) return accum;

    let path = _tree.path.split("/");
    return buildTree(accum, path);
  }, {});
};
