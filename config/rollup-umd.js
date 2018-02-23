import config from './rollup'
import replace from 'rollup-plugin-replace'

config.plugins.push(
  replace({ 'process.env.NODE_ENV': JSON.stringify('development') })
)

config.output = {
  file: './umd/superstruct.js',
  format: 'umd',
  name: 'Superstruct',
}

export default config
