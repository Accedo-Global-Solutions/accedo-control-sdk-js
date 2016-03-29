import baseConfig from './rollup.config';

const additionalConfig = {
  format: 'es6',
  dest: 'dist/bundle.es6.js',
};

const config = Object.assign({}, baseConfig, additionalConfig);
export default config;
