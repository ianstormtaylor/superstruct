import cjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import node from 'rollup-plugin-node-resolve'

export default {
  input: './src/index.js',
  output: {
    file: './lib/index.es.js',
    format: 'es',
    sourcemap: true,
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
      sourceMap: true,
      babelrc: false,
      presets: [
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
      plugins: ['@babel/plugin-proposal-object-rest-spread'],
    }),

    cjs({
      sourceMap: true,
    }),

    node(),
  ],
}
