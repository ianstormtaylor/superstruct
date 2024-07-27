import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  sourcemap: true,
  dts: true,
  format: ['cjs', 'esm', 'iife'],
  globalName: 'Superstruct',
})
