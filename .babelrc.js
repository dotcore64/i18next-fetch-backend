module.exports = ({ env }) => ({
  presets: [
    ['@babel/env', env('test') ? { targets: { node: 'current' } } : {}],
  ],
  plugins: [
    env('test') && 'istanbul',
  ].filter(Boolean),
})
