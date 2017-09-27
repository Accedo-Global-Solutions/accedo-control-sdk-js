/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
import multiEntry from 'rollup-plugin-multi-entry'; // eslint-disable-line import/extensions

export default {
  input: 'test/**/*.js',
  plugins: [multiEntry()],
  output: {
    format: 'cjs',
    intro: 'require("source-map-support").install();',
    file: 'build/test-bundle.js',
    sourcemap: true,
  },
  external: ['uuid', 'stampit', 'qs', 'isomorphic-unfetch', 'chai', 'sinon'],
};
