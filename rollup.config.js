import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'

export default defineConfig({
  input: './src/index.ts',
  plugins: [typescript()],
  output: [
    {
      file: './dist/index.mjs',
      format: 'esm',
      sourcemap: true,
    },
    {
      file: './dist/index.js',
      format: 'umd',
      name: 'Superstruct',
      sourcemap: true,
    },
  ],
})
