import assert, { CallTracker } from 'assert'
import fs from 'fs'
import { pick } from 'lodash'
import { basename, extname, resolve } from 'path'
import {
  any,
  assert as assertValue,
  Context,
  create as createValue,
  deprecated,
  StructError,
} from '../src'

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

  describe('deprecated', () => {
    it('does not log deprecated type if value is undefined', () => {
      const tracker = new CallTracker()
      const logSpy = buildSpyWithZeroCalls(tracker)
      assertValue(undefined, deprecated(any(), logSpy))
      tracker.verify()
    })

    it('logs deprecated type to passed function if value is present', () => {
      const tracker = new CallTracker()
      const fakeLog = (value: unknown, ctx: Context) => {}
      const logSpy = tracker.calls(fakeLog, 1)
      assertValue('present', deprecated(any(), logSpy))
      tracker.verify()
    })
  })
})

/**
 * A helper for testing type signatures.
 */

export function test<T>(fn: (x: unknown) => T) {}

/**
 * This emulates `tracker.calls(0)`.
 *
 * `CallTracker.calls` doesn't support passing `0`, therefore we expect it
 * to be called once which is our call in this test. This proves that
 * the following action didn't call it.
 */
function buildSpyWithZeroCalls(tracker: CallTracker) {
  const logSpy = tracker.calls(1)
  logSpy()
  return logSpy
}
