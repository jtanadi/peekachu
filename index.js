const restana = require("restana");
const cors = require("cors");
const bodyParser = require("body-parser");
const NodeCache = require("node-cache");

const getRepoContents = require("./utils/getRepoContents");

const app = restana();
const cache = new NodeCache();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("", 301, { Location: "https://github.com/raa-tools/operator" });
});

// This endpoint is called only when we push to the GH repo,
// so we should evict and rebuild cache for that repo
app.post("/api/postreceive", async (req, res) => {
  try {
    const { name } = req.body.repository;
    const repoDirs = await getRepoContents(name);
    cache.set(name, repoDirs);
    res.send(204);
  } catch (e) {
    res.send(e);
  }
});

app.get("/api/repo/:name", async (req, res) => {
  const { name } = req.params;

  // Use cached directories if available
  let repoDirs = cache.get(name);
  if (!repoDirs) {
    try {
      repoDirs = await getRepoContents(name);
      res.send(repoDirs);
      cache.set(name, repoDirs);
    } catch (e) {
      res.send(e);
    }
  }
});

app.start(port).then(() => console.log(`Listening on port ${port}`));
