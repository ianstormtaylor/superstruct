import { create } from '../../../src'
import { expect, test } from 'vitest'
import { record, string, number } from '../../../src'

test('Valid record frozen', () => {
  const data = Object.freeze({
    a: 1,
    b: 2,
  })

  const res = create(data, record(string(), number()))

  expect(res).toStrictEqual({
    a: 1,
    b: 2,
  })
})
