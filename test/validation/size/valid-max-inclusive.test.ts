import { assert } from '../../../src'
import { expect, test } from 'vitest'
import { string, size } from '../../../src'

test('Valid size max inclusive', () => {
  const data = 'abcde'
  assert(data, size(string(), 1, 5))
  expect(data).toStrictEqual('abcde')
})
