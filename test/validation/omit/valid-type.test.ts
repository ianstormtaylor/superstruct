import { assert } from '../../../src'
import { expect, test } from 'vitest'
import { omit, type, string, number } from '../../../src'

test('Valid omit type', () => {
  const data = {
    name: 'john',
    unknownProperty: 'unknown',
  }

  assert(
    data,
    omit(
      type({
        name: string(),
        age: number(),
      }),
      ['age']
    )
  )

  expect(data).toStrictEqual({
    name: 'john',
    unknownProperty: 'unknown',
  })
})
