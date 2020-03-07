require("dotenv").config();

const owner = "raa-scripts";
const repo = "indd";
const api = `https://api.github.com/repos/${owner}/${repo}`;
const authHeader = {
  Authorization: `token ${process.env.GITHUB_TOKEN}`,
  "User-Agent": "jtanadi"
};

module.exports = { owner, repo, api, authHeader };
