/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
import multiEntry from 'rollup-plugin-multi-entry'; // eslint-disable-line import/extensions

export default {
  entry: './example-es6.js',
  plugins: [multiEntry()],
  format: 'cjs',
  intro: 'require("source-map-support").install();',
  dest: './build/example.js',
  sourceMap: true,
  external: ['uuid', 'stampit', 'qs', 'isomorphic-unfetch', 'chalk', 'fs'],
};
