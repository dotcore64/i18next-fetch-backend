module.exports = ({ env }) => env('test')
  ? {
    plugins: ['istanbul'],
  }
  : {
    presets: ['@babel/env', env('test') ? { target: { node: 'current' } } : {}],
  };
