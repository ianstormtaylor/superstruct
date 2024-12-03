import { assert } from '../../../src'
import { expect, test } from 'vitest'
import { unknown } from '../../../src'

test('Valid unknown number', () => {
  const data = 1
  assert(data, unknown())
  expect(data).toStrictEqual(1)
})
