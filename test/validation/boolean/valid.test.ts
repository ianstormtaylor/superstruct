import { assert } from '../../../src'
import { expect, test } from 'vitest'
import { boolean } from '../../../src'

test('Valid boolean', () => {
  const data = true
  assert(data, boolean())
  expect(data).toStrictEqual(true)
})
