const express = require("express");
const cors = require("cors");
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

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.redirect(301, "https://github.com/raa-scripts/operator");
});

// This endpoint is called every time we push
// to the Github repo, so we evict and rebuild cache
app.post("/api/postreceive", async (req, res) => {
  const { name } = req.body.repository;
  REPOS[name] = await getDirs(name);
  res.sendStatus(204);
});

app.get("/api/repo/:name", async (req, res) => {
  const { name } = req.params;

  // Use cached directories if available
  if (!REPOS[name]) {
    REPOS[name] = await getDirs(name);
  }
  res.send(REPOS[name]);
});

app.listen(port, console.log(`Listening on port ${port}`));
