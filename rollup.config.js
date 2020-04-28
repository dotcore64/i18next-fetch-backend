import babel from '@rollup/plugin-babel';
import pkg from './package.json';

const input = 'src/index.js';
const plugins = [babel()];

const name = 'I18nextFetchBackend';

export default [{
  input,
  // sourcemaps help generate coverage reports for the actual sources using istanbul
  output: { file: `dist/${pkg.name}.cjs.js`, format: 'cjs', sourcemap: true },
  plugins,
}, {
  input,
  output: { file: `dist/${pkg.name}.esm.js`, format: 'esm' },
  plugins,
}, {
  input,
  output: { file: `dist/${pkg.name}.umd.js`, format: 'umd', name },
  plugins,
}];
