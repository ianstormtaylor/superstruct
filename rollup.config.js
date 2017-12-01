const pkg = require('./package');

module.exports = {
  input: 'src/index.js',

  plugins: [
    require('rollup-plugin-buble')({
      objectAssign: 'Object.assign',
      transforms: { modules:false }
    }),
    require('rollup-plugin-commonjs')({
      sourceMap: false
    }),
    require('rollup-plugin-node-resolve')({
      jsnext: true
    })
  ],

  watch: {
    clearScreen: true
  },

  // for `watch` only
  output: {
    file: pkg.main,
    format: 'cjs'
  }
};
