/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/index.js',
  format: 'umd',
  dest: 'dist/bundle.umd.js',
  moduleName: 'appgrid',
  sourceMap: false,
  plugins: [babel()]
};
