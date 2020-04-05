<div align="center">
    <img src="./docs/peeker-01.png" alt="peeker illustration" height="300">
    <h1>👀️ peekachu 👀️</h1>
</div>

`peekachu` is a RESTful microservice that gathers all visible directories and files of a public repo and returns their names. The server works with the GitHub webhook to fetch the latest commit of a repo.

Similar to a CDN, `peekachu` serves as a convenience layer and a cache of sorts. Rather than having to ping the GitHub API directly every time we need a list of directories and file, `peekachu` does the fetching and storing of data.

## API Endpoints
###`GET /api/ping`
Pings the server to wake it up. Returns a `204` status code.

### `POST /api/postreceive`
Endpoint for GitHub webhook. Accepts default payload from GitHub, but the only value consumed is `repository.name`.

URL to use for webhooks: `https://raa-peekachu.herokuapp.com/api/postreceive`.

### `GET /api/repo/:name`
Returns names of directories and files from a specified repo. `repoName` must be valid.

#### Payload
Data is returned in `JSON` format. Directories are returned as recursive / nested objects. Files are listed in an array in `directory["."]`.

Sample:
```json
{
  "_lib": {
    ".": [
      "checkExtension.js",
      "getExtension.js",
      "getNameFromPath.js",
      "zFill.js",
      "zip.js"
    ]
  },
  "aiTest": {
    ".": ["aiTest.js", "collectLayerNames.js"]
  },
  "slugger": {
    ".": ["slugSetup2.jsx", "slugUpdate.jsx"],
    "z-old": {
      ".": ["slugSetup.jsx", "slugSetup_PIMA.jsx"]
    }
  }
}
```
