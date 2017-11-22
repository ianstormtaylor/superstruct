
import 'babel-polyfill'

import assert from 'assert'
import fs from 'fs'
import pick from 'lodash/pick'
import { basename, extname, resolve } from 'path'

/**
 * Tests.
 */

describe('superstruct', () => {
  const testsDir = resolve(__dirname, 'fixtures')
  const tests = fs.readdirSync(testsDir).filter(t => t[0] !== '.').map(t => basename(t, extname(t)))

  for (const test of tests) {
    it(test, async () => {
      const module = require(resolve(testsDir, test))
      const { struct, value } = module

      if ('output' in module) {
        const expected = module.output
        const actual = struct(value)
        assert.deepEqual(actual, expected)
      }

      else if ('error' in module) {
        assert.throws(() => {
          struct(value)
        }, (e) => {
          const expected = module.error
          const actual = pick(e, 'code', 'key', 'index', 'path', 'value')
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
