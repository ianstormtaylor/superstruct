
import 'babel-polyfill'

import assert from 'assert'
import fs from 'fs'
import pick from 'lodash.pick'
import { basename, extname, resolve } from 'path'

/**
 * Tests.
 */

describe('superstruct', () => {
  const kindsDir = resolve(__dirname, 'fixtures')
  const kinds = fs.readdirSync(kindsDir).filter(t => t[0] !== '.').map(t => basename(t, extname(t)))

  for (const kind of kinds) {
    describe(kind, () => {
      const testsDir = resolve(kindsDir, kind)
      const tests = fs.readdirSync(testsDir).filter(t => t[0] !== '.').map(t => basename(t, extname(t)))

      for (const test of tests) {
        it(test, async () => {
          const module = require(resolve(testsDir, test))
          const { Struct, data } = module

          if ('output' in module) {
            const expected = module.output
            const actual = Struct(data)
            assert.deepEqual(actual, expected)
          }

          else if ('error' in module) {
            assert.throws(() => {
              Struct(data)
            }, (e) => {
              const expected = module.error
              const actual = pick(e, 'type', 'path', 'value')
              assert.deepEqual(actual, expected)
              return true
            })
          }

          else {
            throw new Error(`The "${test}" fixture did not define an \`output\` or \`error\` export.`)
          }
        })
      }
    })
  }
})
