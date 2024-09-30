import { assert } from '../../../src'
import { expect, test } from 'vitest'
import { partial, object, string, number } from '../../../src'

test('Composed partial', () => {
  const data = {
    name: 'john',
  }

  assert(
    data,
    partial(
      object({
        name: string(),
        age: number(),
      })
    )
  )

  expect(data).toStrictEqual({
    name: 'john',
  })
})
