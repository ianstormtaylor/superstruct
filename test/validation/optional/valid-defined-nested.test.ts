import { assert } from '../../../src'
import { expect, test } from 'vitest'
import { type, string, number, optional } from '../../../src'

test('Valid optional defined nested', () => {
  const data = {
    name: 'Jill',
    age: 42,
  }

  assert(
    data,
    type({
      name: optional(string()),
      age: number(),
    })
  )

  expect(data).toStrictEqual({
    name: 'Jill',
    age: 42,
  })
})
