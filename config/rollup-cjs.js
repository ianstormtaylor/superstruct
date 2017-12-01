
import config from './rollup'

config.output = {
  file: './lib/index.js',
  format: 'cjs',
  name: 'Superstruct',
  sourcemap: true,
}

export default config
