import { assert } from '../../../src'
import { expect, test } from 'vitest'
import { number, min } from '../../../src'

test('Valid min', () => {
  const data = 3
  assert(data, min(number(), 0))
  expect(data).toStrictEqual(3)
})
