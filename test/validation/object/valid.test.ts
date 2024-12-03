import { assert } from '../../../src'
import { expect, test } from 'vitest'
import { object, string, number } from '../../../src'

test('Valid object', () => {
  const data = {
    name: 'john',
    age: 42,
  }

  assert(
    data,
    object({
      name: string(),
      age: number(),
    })
  )

  expect(data).toStrictEqual({
    name: 'john',
    age: 42,
  })
})
