import { create } from '../../../src'
import { expect, test } from 'vitest'
import { number, defaulted } from '../../../src'

test('Function defaulted', () => {
  const data = undefined
  const res = create(
    data,
    defaulted(number(), () => 42)
  )
  expect(res).toStrictEqual(42)
})
