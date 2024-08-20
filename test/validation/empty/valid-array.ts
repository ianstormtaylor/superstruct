import { assert } from '../../../src'
import { expect, test } from 'vitest'
import { number, array, empty } from '../../../src'

test('Valid empty array', () => {
  const data = []
  assert(data, empty(array(number())))
  expect(data).toStrictEqual([])
})
