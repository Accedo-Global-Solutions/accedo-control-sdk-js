export default {
  input: 'src/index.js',
  output: {
    format: 'cjs',
    file: 'dist/appgrid.js',
    name: 'appgrid',
    sourcemap: false,
    exports: 'default',
  },
  external: ['uuid', 'stampit', 'qs', 'isomorphic-unfetch'],
};
