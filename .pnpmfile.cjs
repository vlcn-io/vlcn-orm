module.exports = {
  hooks: {
    readPackage,
  },
};

function readPackage(pkg) {
  if (pkg.dependencies && pkg.dependencies.sqlite3) {
    pkg.dependencies.sqlite3 = '5.0.8';
  }
  return pkg;
}
