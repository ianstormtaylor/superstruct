import { assert } from '../../../src'
import { expect, test } from 'vitest'
import { deprecated, number } from '../../../src'

test('Valid deprecated undefined', () => {
  const data = undefined
  assert(
    data,
    deprecated(number(), () => {})
  )
  expect(data).toStrictEqual(undefined)
})
