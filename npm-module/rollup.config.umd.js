import baseConfig from './rollup.config';

const additionalConfig = {
  format: 'umd',
  dest: 'dist/bundle.umd.js',
  moduleName: 'appgrid'
};

const config = Object.assign({}, baseConfig, additionalConfig);
export default config;
