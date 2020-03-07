const express = require("express");
const getDirs = require("./utils/getDirs");

const app = express();
const port = process.env.PORT || 3000;

// Simple cache
// { dir1: [file1.ext, file2.ext, file3.ext], dir2: ...}
let DIRS = {};

// This endpoint is called every time we push
// to the Github repo, so we evict and rebuild cache
app.post("/api/postreceive", async (req, res) => {
  DIRS = await getDirs();
  res.sendStatus(204);
});

app.get("/api/getdirs", async (req, res) => {
  // Use cached directories if available
  if (!Object.keys(DIRS).length) {
    DIRS = await getDirs();
  }
  res.send(DIRS);
});

app.listen(port, console.log(`Listening on port ${port}`));
