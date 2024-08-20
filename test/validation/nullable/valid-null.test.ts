import { assert } from '../../../src'
import { expect, test } from 'vitest'
import { number, nullable } from '../../../src'

test('Valid nullable null', () => {
  const data = null
  assert(data, nullable(number()))
  expect(data).toStrictEqual(null)
})
