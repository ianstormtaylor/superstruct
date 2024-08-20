import { assert } from '../../../src'
import { expect, test } from 'vitest'
import { number, max } from '../../../src'

test('Valid max inclusive', () => {
  const data = 0
  assert(data, max(number(), 0))
  expect(data).toStrictEqual(0)
})
