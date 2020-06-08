import babel from 'rollup-plugin-babel'
import cjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import node from 'rollup-plugin-node-resolve'
import typescript from 'rollup-plugin-ts'
import { terser } from 'rollup-plugin-terser'
import config from './rollup'

config.output = {
  file: './umd/superstruct.min.js',
  format: 'umd',
  name: 'Superstruct',
}

config.plugins = [
  typescript(),

  babel({
    exclude: 'node_modules/**',
    sourceMap: true,
    babelrc: false,
    extensions: ['.ts'],
    presets: [
      '@babel/typescript',
      [
        '@babel/preset-env',
        {
          targets: {
            browsers: ['last 2 versions'],
          },
          modules: false,
          useBuiltIns: false,
          loose: true,
        },
      ],
    ],
    plugins: [
      'babel-plugin-dev-expression',
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/plugin-proposal-class-properties',
    ],
  }),

  cjs({
    sourceMap: false,
  }),

  node({
    extensions: ['.ts'],
  }),

  replace({
    'process.env.NODE_ENV': JSON.stringify('production'),
  }),

  terser(),
]

export default config
