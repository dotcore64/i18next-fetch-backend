module.exports = ({ env }) => !env('test') && {
    presets: ['@babel/env'],
};
