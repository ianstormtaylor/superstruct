import { assert } from '../../../src'
import { expect, test } from 'vitest'
import { type, string, number } from '../../../src'

test('Valid type', () => {
  const data = {
    name: 'john',
    age: 42,
  }

  assert(
    data,
    type({
      name: string(),
      age: number(),
    })
  )

  expect(data).toStrictEqual(data)
})
