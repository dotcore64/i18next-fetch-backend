module.exports = {
  extends: ['plugin:mocha/recommended'],
  plugins: ['mocha'],
  env: {
    mocha: true,
  },
  rules: {
    "mocha/no-mocha-arrows": 0,
  }
};
