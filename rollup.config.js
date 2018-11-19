import babel from 'rollup-plugin-babel';
import pkg from './package.json';

const input = 'src/index.js';
const plugins = [
  babel({ exclude: '**/node_modules/**' }),
];

const name = 'I18nextFetchBackend';

export default [{
  input,
  output: { file: `dist/${pkg.name}.cjs.js`, format: 'cjs' },
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
