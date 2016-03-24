import config from './rollup.config';

config.format = 'umd';
config.dest = 'dist/bundle.umd.js';
config.moduleName = 'appgrid';

export default config;
