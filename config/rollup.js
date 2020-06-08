import babel from 'rollup-plugin-babel'
import cjs from 'rollup-plugin-commonjs'
import node from 'rollup-plugin-node-resolve'
import typescript from 'rollup-plugin-ts'

export default {
  input: './src/index.ts',
  output: {
    file: './lib/index.es.js',
    format: 'es',
    sourcemap: true,
  },
  plugins: [
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
              // browsers: ['last 2 versions'],
              node: true,
            },
            modules: false,
            useBuiltIns: false,
            loose: true,
          },
        ],
      ],
      plugins: [
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-proposal-class-properties',
      ],
    }),

    cjs({
      sourceMap: true,
    }),

    node({
      extensions: ['.ts'],
    }),
  ],
}
