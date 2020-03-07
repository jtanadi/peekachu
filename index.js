const express = require("express");
const bodyParser = require("body-parser");

const getDirs = require("./utils/getDirs");

const app = express();
const port = process.env.PORT || 3000;

// Simple cache
// {
//   repo1: {
//     dir1: [file1.ext, file2.ext, file3.ext],
//     dir2: ...
//   }
// }
let REPOS = {};

app.use(bodyParser.json());

app.get("/", (req, res) => {
  const text = `POST /api/postreceive
  GET /api/getrepos/:repoName
  `;
  res.send(text);
});

// This endpoint is called every time we push
// to the Github repo, so we evict and rebuild cache
app.post("/api/postreceive", async (req, res) => {
  const { name } = req.body.repository;
  REPOS[name] = await getDirs(name);
  res.sendStatus(204);
});

app.get("/api/getrepos/:repoName", async (req, res) => {
  const { repoName } = req.params;

  // Use cached directories if available
  if (!REPOS[repoName]) {
    REPOS[repoName] = await getDirs(repoName);
  }
  res.send(REPOS[repoName]);
});

app.listen(port, console.log(`Listening on port ${port}`));
