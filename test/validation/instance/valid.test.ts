import { assert } from '../../../src'
import { expect, test } from 'vitest'
import { instance } from '../../../src'

test('Valid instance', () => {
  const data = [1]
  assert(data, instance(Array))
  expect(data).toStrictEqual([1])
})
