const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const NodeCache = require("node-cache");

const getRepoContents = require("./utils/getRepoContents");

const app = express();
const cache = new NodeCache();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.redirect(301, "https://github.com/raa-scripts/operator");
});

// This endpoint is called only when we push to the GH repo,
// so we should evict and rebuild cache for that repo
app.post("/api/postreceive", async (req, res) => {
  const { name } = req.body.repository;
  const repoDirs = await getRepoContents(name);
  cache.set(name, repoDirs);
  res.sendStatus(204);
});

app.get("/api/repo/:name", async (req, res) => {
  const { name } = req.params;

  // Use cached directories if available
  let repoDirs = cache.get(name);
  if (!repoDirs) {
    repoDirs = await getRepoContents(name);
  }
  res.send(repoDirs);
  cache.set(name, repoDirs);
});

app.listen(port, console.log(`Listening on port ${port}`));
