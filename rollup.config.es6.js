export default {
  entry: 'src/index.js',
  format: 'es',
  dest: 'dist/bundle.es6.js',
  sourceMap: false,
  external: ['uuid', 'stampit', 'qs', 'isomorphic-fetch'],
};
