import { create } from '../../../src'
import { expect, test } from 'vitest'
import { union, string, number, defaulted, type } from '../../../src'

const A = string()
const B = type({ a: number(), b: defaulted(number(), 5) })

test('Coercion union type', () => {
  const data = { a: 5 }
  const res = create(data, union([A, B]))
  expect(res).toStrictEqual({ a: 5, b: 5 })
})
