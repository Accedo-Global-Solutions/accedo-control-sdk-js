import baseConfig from './rollup.config';

const additionalConfig = {
  format: 'es',
  dest: 'dist/bundle.es6.js'
};

const config = Object.assign({}, baseConfig, additionalConfig);
export default config;
