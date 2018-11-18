module.exports = ({ env }) => ({
  presets: [
    ['@babel/env', env('test') ? { targets: { node: 'current' } } : {}],
  ],
})
