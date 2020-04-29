module.exports = ({ env }) => env('test')
  ? {
    plugins: ['istanbul'],
  }
  : {
    presets: ['@babel/env'],
    plugins: ['@babel/proposal-class-properties'],
  };
