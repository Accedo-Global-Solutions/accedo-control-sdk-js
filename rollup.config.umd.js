/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
import buble from 'rollup-plugin-buble';

export default {
  entry: 'src/index.js',
  format: 'umd',
  dest: 'dist/bundle.umd.js',
  moduleName: 'appgrid',
  sourceMap: false,
  plugins: [buble()]
};
