import { assert } from '../../../src'
import { expect, test } from 'vitest'
import { string, number, map, empty } from '../../../src'

test('Valid empty map', () => {
  const data = new Map()
  assert(data, empty(map(number(), string())))
  expect(data).toStrictEqual(data)
})
