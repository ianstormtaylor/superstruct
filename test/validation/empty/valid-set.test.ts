import { assert } from '../../../src'
import { expect, test } from 'vitest'
import { number, set, empty } from '../../../src'

test('Valid empty set', () => {
  const data = new Set()
  assert(data, empty(set(number())))
  expect(data).toStrictEqual(data)
})
