import { create } from '../../../src'
import { expect, test } from 'vitest'
import { tuple, string, number } from '../../../src'

test('Valid tuple frozen', () => {
  const data = Object.freeze(['A', 1])
  const res = create(data, tuple([string(), number()]))
  expect(res).toStrictEqual(['A', 1])
})
