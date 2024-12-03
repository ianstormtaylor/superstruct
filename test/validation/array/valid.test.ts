import { assert } from '../../../src'
import { expect, test } from 'vitest'
import { array, number } from '../../../src'

test('Valid array', () => {
  const data = [1, 2, 3]
  assert(data, array(number()))
  expect(data).toStrictEqual([1, 2, 3])
})
