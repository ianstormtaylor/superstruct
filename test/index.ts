import assert from 'assert'
import fs from 'fs'
import { pick } from 'lodash'
import { basename, extname, resolve } from 'path'
import { assert as assertValue, coerce as coerceValue } from '..'

describe('superstruct', () => {
  const kindsDir = resolve(__dirname, 'fixtures')
  const kinds = fs
    .readdirSync(kindsDir)
    .filter((t) => t[0] !== '.')
    .map((t) => basename(t, extname(t)))

  for (const kind of kinds) {
    describe(kind, () => {
      const testsDir = resolve(kindsDir, kind)
      const tests = fs
        .readdirSync(testsDir)
        .filter((t) => t[0] !== '.')
        .map((t) => basename(t, extname(t)))

      for (const test of tests) {
        const module = require(resolve(testsDir, test))
        const { Struct, data, coerce, only, skip, output, error } = module
        const run = only ? it.only : skip ? it.skip : it
        run(test, () => {
          let actual
          let err

          try {
            if (coerce) {
              actual = coerceValue(data, Struct)
            } else {
              assertValue(data, Struct)
              actual = data
            }
          } catch (e) {
            err = e
          }

          if ('output' in module) {
            if (err) {
              throw new Error(
                `Expected "${test}" fixture not to throw an error but it did:\n\n${err}`
              )
            }

            assert.deepEqual(actual, output)
          } else if ('error' in module) {
            if (!err) {
              throw new Error(
                `Expected "${test}" fixture to throw an error but it did not.`
              )
            }

            const actualError = pick(err, 'type', 'path', 'value')
            assert.deepEqual(actualError, error)
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
