module.exports = {
  reporter: 'spec',
  ui: 'bdd',
  require: ['esm', 'env-test', '@babel/register', 'isomorphic-fetch'],
}
