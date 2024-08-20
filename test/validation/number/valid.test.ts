import { assert } from '../../../src'
import { expect, test } from 'vitest'
import { number } from '../../../src'

test('Valid number', () => {
  const data = 42
  assert(data, number())
  expect(data).toStrictEqual(42)
})
