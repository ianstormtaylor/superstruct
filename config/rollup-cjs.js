import config from './rollup'

config.output = {
  file: './lib/index.cjs.js',
  format: 'cjs',
  name: 'Superstruct',
  sourcemap: true,
}

export default config
