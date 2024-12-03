import { create } from '../../../src'
import { expect, test } from 'vitest'
import { array, number } from '../../../src'

test('Valid array frozen', () => {
  const data = Object.freeze([1, 2, 3])
  const res = create(data, array(number()))
  expect(res).toStrictEqual([1, 2, 3])
})
