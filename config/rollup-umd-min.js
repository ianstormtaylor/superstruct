
import babel from 'rollup-plugin-babel'
import cjs from 'rollup-plugin-commonjs'
import node from 'rollup-plugin-node-resolve'
import uglify from 'rollup-plugin-uglify'
import { minify } from 'uglify-es'

import config from './rollup'

config.output = {
  file: './umd/superstruct.min.js',
  format: 'umd',
  name: 'Superstruct',
}

config.plugins = [
  babel({
    exclude: 'node_modules/**',
    sourceMap: true,
    babelrc: false,
    plugins: [
      'external-helpers',
      'dev-expression',
      'transform-inline-environment-variables',
      'transform-async-to-generator',
      'transform-object-rest-spread',
    ]
  }),
  cjs({
    sourceMap: false,
  }),
  node(),
  uglify({}, minify)
]

export default config
