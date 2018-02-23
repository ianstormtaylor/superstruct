import assert from 'assert'
import fs from 'fs'
import { pick } from 'lodash'
import { basename, extname, resolve } from 'path'

/**
 * Tests.
 */

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
        it(test, () => {
          const module = require(resolve(testsDir, test))
          const { Struct, data } = module

          if ('output' in module) {
            const expected = module.output
            const actual = Struct(data)
            assert.deepEqual(actual, expected)
          } else if ('error' in module) {
            const [error] = Struct.validate(data)
            const actual =
              error.reason !== undefined || 'reason' in module.error
                ? pick(error, 'type', 'path', 'value', 'reason')
                : pick(error, 'type', 'path', 'value')
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
