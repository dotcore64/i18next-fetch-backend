import babel from '@rollup/plugin-babel';

const input = 'src/index.js';
const plugins = [babel({ babelHelpers: 'bundled' })];

const name = 'I18nextFetchBackend';

export default [{
  input,
  // sourcemaps help generate coverage reports for the actual sources using istanbul
  output: {
    file: 'dist/cjs/index.js',
    format: 'cjs',
    sourcemap: true,
    exports: 'default',
  },
  plugins,
}, {
  input,
  output: {
    file: 'dist/mjs/index.js',
    format: 'esm',
    sourcemap: true,
  },
  plugins,
}, {
  input,
  output: {
    file: 'dist/umd/index.js',
    format: 'umd',
    name,
  },
  plugins,
}];
