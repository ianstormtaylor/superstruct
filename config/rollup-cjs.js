import config from './rollup'

config.output = {
  file: './lib/index.cjs',
  format: 'cjs',
  name: 'Superstruct',
  sourcemap: true,
}

export default config
