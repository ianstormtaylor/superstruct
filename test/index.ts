import assert from 'assert'
import fs from 'fs'
import { pick } from 'lodash'
import { basename, extname, resolve } from 'path'
import { validate } from '..'

describe('superstruct', () => {
  const kindsDir = resolve(__dirname, 'fixtures')
  const kinds = fs
    .readdirSync(kindsDir)
    .filter(t => t[0] !== '.')
    .map(t => basename(t, extname(t)))

  for (const kind of kinds) {
    describe(kind, () => {
      const testsDir = resolve(kindsDir, kind)
      const tests = fs
        .readdirSync(testsDir)
        .filter(t => t[0] !== '.')
        .map(t => basename(t, extname(t)))

      for (const test of tests) {
        const module = require(resolve(testsDir, test))
        const { Struct, data, coerce, only, skip } = module
        const run = only ? it.only : skip ? it.skip : it
        run(test, () => {
          const [error, actual] = validate(data, Struct, coerce)

          if ('output' in module) {
            assert.deepEqual(actual, module.output)
          } else if ('error' in module) {
            if (!error) {
              throw new Error(
                `Expected "${test}" fixture to throw an error but it did not.`
              )
            }

            const actual = pick(error, 'type', 'path', 'value')
            assert.deepEqual(actual, module.error)
          } else {
            throw new Error(
              `The "${test}" fixture did not define an \`output\` or \`error\` export.`
            )
          }
        })
      }
    })
  }
})
