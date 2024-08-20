import { assert } from '../../../src'
import { expect, test } from 'vitest'
import { literal } from '../../../src'

test('Valid literal', () => {
  const data = 42
  assert(data, literal(42))
  expect(data).toStrictEqual(42)
})
