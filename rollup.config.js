import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'

export default defineConfig({
  input: './src/index.ts',
  plugins: [typescript()],
  output: [
    {
      file: './lib/index.mjs',
      format: 'esm',
      sourcemap: true,
    },
    {
      file: './lib/index.cjs',
      format: 'cjs',
      sourcemap: true,
    },
  ],
})
