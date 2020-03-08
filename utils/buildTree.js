const buildTree = (acc, path) => {
  // Given an accumulator object and a path list,
  // return tree object from a path array
  // ["a", "b", "c"] => { a: { b: { ".": [c] } } }
  // ["a", "b", "d"] => { a: { b: { ".": [c, d] } } }

  // Edge case: array has no directories (only file name)
  // ["readme.md"] => { ".": ["readme.md"] }
  if (path.length === 1) {
    const fileName = path[0];
    if (!acc["."] || acc["."] === fileName) {
      return { ...acc, ["."]: [fileName] };
    }
    return { ...acc, ["."]: [...acc["."], fileName] };
  }

  const dir = path[0];
  let v;

  // Base case: [directory, fileName]
  // ["a", "b"] => { a: { ".": [b] } }
  if (path.length === 2) {
    const fileName = path[1];
    const filesArr =
      acc[dir] && acc[dir]["."] ? [...acc[dir]["."], fileName] : [fileName];
    v = { ".": filesArr };
  } else {
    const obj = acc[dir] || {};
    v = buildTree(obj, path.slice(1));
  }

  return { ...acc, [dir]: v };
};

module.exports = buildTree;
