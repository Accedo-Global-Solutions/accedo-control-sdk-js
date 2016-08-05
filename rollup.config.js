import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/index.js',
  sourceMap: false,
  plugins: [babel()]
};
