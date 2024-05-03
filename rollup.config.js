import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import tscAlias from 'tsc-alias';

const tscAliasPlugin = () =>  {
    return {
      name: 'tscAlias',
      async writeBundle(options) {
        return tscAlias.replaceTscAliasPaths(options);
      }
    }
  }

export default defineConfig({
  input: './src/index.ts',
  plugins: [typescript(), tscAliasPlugin()],
  output: [
    {
      file: './dist/index.mjs',
      format: 'esm',
      sourcemap: true,
    },
    {
      file: './dist/index.cjs',
      format: 'umd',
      name: 'Superstruct',
      sourcemap: true,
    },
  ],
})
