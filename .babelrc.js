module.exports = ({ env }) => ({
  presets: [
    ['@babel/env', env('test') ? { targets: { node: 'current' } } : {}],
  ],
  plugins: [
    '@babel/proposal-class-properties',
    env('test') && 'istanbul',
  ].filter(Boolean),
})
