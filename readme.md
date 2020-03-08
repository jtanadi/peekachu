# operator
operator is a REST microservice that gathers all visible directories and files of a repo and returns their names. The microservice works with the Github webhook to fetch the latest commit of a repo.

Similar to a CDN, operator serves as a convenience layer and a cache of sorts. Rather than having to ping the Github API directly every time we need a list of directories and file, operator does the fetching and storing of data.

## API Endpoints
### `POST /api/postreceive`
Endpoint for Github webhook. Accepts default payload from Github, but the only value consumed is `repository.name`.

URL to use for webhooks: `https://raa-operator.herokuapp.com/api/postreceive`.

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
        ".": [
            "aiTest.js",
            "collectLayerNames.js"
        ]
    },
    "slugger": {
        ".": [
            "slugSetup2.jsx",
            "slugUpdate.jsx"
        ],
        "z-old": {
            ".": [
                "slugSetup.jsx",
                "slugSetup_PIMA.jsx"
            ]
        }
    }
}
```

