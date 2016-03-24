import babel from 'rollup-plugin-babel';
import multiEntry from 'rollup-plugin-multi-entry';

export default {
  entry: './example-es6.js',
  plugins: [babel(), multiEntry()],
  format: 'cjs',
  intro: 'require("source-map-support").install();',
  dest: './build/example.js',
  sourceMap: true
};
