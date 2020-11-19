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

      for (const name of tests) {
        const module = require(resolve(testsDir, name))
        const { Struct, data, coerce, only, skip, output, failures } = module
        const run = only ? it.only : skip ? it.skip : it
        run(name, () => {
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
                `Expected "${name}" fixture not to throw an error but it did:\n\n${err}`
              )
            }

            assert.deepEqual(actual, output)
          } else if ('failures' in module) {
            if (!err) {
              throw new Error(
                `Expected "${name}" fixture to throw an error but it did not.`
              )
            }

            const actualFailures = (err.failures() as object[]).map((failure) =>
              pick(failure, 'type', 'path', 'value', 'branch')
            )
            assert.deepEqual(actualFailures, failures)
            assert.deepEqual(
              pick(err, 'type', 'path', 'value', 'branch'),
              failures[0]
            )
          } else {
            throw new Error(
              `The "${name}" fixture did not define an \`output\` or \`failures\` export.`
            )
          }
        })
      }
    })
  }
})

/**
 * A helper for testing type signatures.
 */

export function test<T>(fn: (x: unknown) => T) {}
