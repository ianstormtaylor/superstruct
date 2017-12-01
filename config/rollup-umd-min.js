
import babel from 'rollup-plugin-babel'
import cjs from 'rollup-plugin-commonjs'
import node from 'rollup-plugin-node-resolve'

import config from './rollup'

config.output = {
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
]

export default config
