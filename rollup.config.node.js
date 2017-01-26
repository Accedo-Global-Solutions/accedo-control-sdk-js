export default {
  entry: 'src/index.js',
  format: 'cjs',
  dest: 'dist/appgrid.js',
  moduleName: 'appgrid',
  exports: 'default',
  sourceMap: false,
  external: ['uuid', 'stampit', 'qs', 'isomorphic-fetch'],
};
