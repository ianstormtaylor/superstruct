import { assert } from '../../../src'
import { expect, test } from 'vitest'
import { number, pick, string, type } from '../../../src'

test('Valid pick type', () => {
  const data = {
    name: 'john',
    unknownProperty: true,
  }

  assert(
    data,
    pick(
      type({
        name: string(),
        age: number(),
      }),
      ['name']
    )
  )

  expect(data).toStrictEqual({
    name: 'john',
    unknownProperty: true,
  })
})
