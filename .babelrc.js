module.exports = ({ env }) => env('test')
  ? {
    presets: [['@babel/env', { targets: { node: 'current' } }]],
    plugins: ['istanbul'],
  }
  : {
    presets: ['@babel/env'],
    plugins: ['@babel/proposal-class-properties'],
  };
