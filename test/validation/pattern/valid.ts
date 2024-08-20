import { assert } from '../../../src'
import { expect, test } from 'vitest'
import { string, pattern } from '../../../src'

test('Valid pattern', () => {
  const data = '123'
  assert(data, pattern(string(), /\d+/))
  expect(data).toStrictEqual('123')
})
