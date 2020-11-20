import assert from 'assert'
import fs from 'fs'
import { pick } from 'lodash'
import { basename, extname, resolve } from 'path'
import { assert as assertValue, create as createValue, StructError } from '..'

describe('superstruct', () => {
  describe('api', () => {
    require('./api/assert')
    require('./api/create')
    require('./api/is')
    require('./api/mask')
    require('./api/validate')
  })

  describe('validation', () => {
    const kindsDir = resolve(__dirname, 'validation')
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
          const { Struct, data, create, only, skip, output, failures } = module
          const run = only ? it.only : skip ? it.skip : it
          run(name, () => {
            let actual
            let err

            try {
              if (create) {
                actual = createValue(data, Struct)
              } else {
                assertValue(data, Struct)
                actual = data
              }
            } catch (e) {
              if (!(e instanceof StructError)) {
                throw e
              }

              err = e
            }

            if ('output' in module) {
              if (err) {
                throw new Error(
                  `Expected "${name}" fixture not to throw an error but it did:\n\n${err}`
                )
              }

              assert.deepStrictEqual(actual, output)
            } else if ('failures' in module) {
              if (!err) {
                throw new Error(
                  `Expected "${name}" fixture to throw an error but it did not.`
                )
              }

              const props = ['type', 'path', 'refinement', 'value', 'branch']
              const actualFailures = err
                .failures()
                .map((failure) => pick(failure, ...props))

              assert.deepStrictEqual(actualFailures, failures)
              assert.deepStrictEqual(pick(err, ...props), failures[0])
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
})

/**
 * A helper for testing type signatures.
 */

export function test<T>(fn: (x: unknown) => T) {}
