import { assert } from '../../../src'
import { expect, test } from 'vitest'
import { pick, object, string, number } from '../../../src'

test('Valid pick', () => {
  const data = {
    name: 'john',
  }

  assert(
    data,
    pick(
      object({
        name: string(),
        age: number(),
      }),
      ['name']
    )
  )

  expect(data).toStrictEqual({
    name: 'john',
  })
})
