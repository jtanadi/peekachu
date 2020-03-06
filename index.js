const axios = require("axios")
const express = require("express")

require('dotenv').config()

const app = express()

const owner = "raa-scripts"
const repo = "indd"
const githubAPI = `https://api.github.com/repos/${owner}/${repo}`
const authHeader = { "Authorization": `token ${process.env.GITHUB_TOKEN}` }

let TREES = []

const getTrees = async () => {
  const commitSHA = await axios.get(githubAPI + "/commits", { headers: authHeader})
    .then(_res => _res.data)
    .then(data => data[0])
    .then(commit => commit.sha)
    .catch(e => console.log(e.data))

  const trees = await axios.get(githubAPI + `/git/trees/${commitSHA}`, { headers: authHeader})
    .then(_res => _res.data)
    .then(data => data.tree)
    .catch(e => console.log(e.data))

  for (let i = 0; i < trees.length; i++) {
    const tree = trees[i]
    const obj = {
      dir: tree.path
    }

    console.log(tree)



    // const paths = _trees.map(_tree => _tree.path)
    // retObj["files"] = paths

    // console.log(obj)
    // TREES.push(obj)
  }


  // TREES = trees.map(async tree => {
  //   const retObj = {
  //     dir: tree.path
  //   }
  //   const f = await axios.get(githubAPI + `/git/trees/${tree.sha}`)
  //     .then(_res => _res.data)
  //     .then(data => data.tree)
  //     .then(ts => {
  //       const paths = ts.map(t => t.path)
  //       retObj["files"] = paths
  //     })
  //     .catch(e => console.log(e))
  //   return retObj
  // })
}

app.get("/api/postreceive", async (req, res) => {
  getTrees()
  res.sendStatus(204)
})

app.get("/api/getdirs", async (req, res) => {
  if (!TREES.length) {
    getTrees()
  }
  res.send(TREES)
})

app.listen(3000, console.log("listening on port 3000"))
