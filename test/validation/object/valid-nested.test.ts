import { assert } from '../../../src'
import { expect, test } from 'vitest'
import { object, string } from '../../../src'

test('Valid object nested', () => {
  const data = {
    name: 'john',
    address: {
      street: '123 Fake St',
      city: 'Springfield',
    },
  }

  assert(
    data,
    object({
      name: string(),
      address: object({
        street: string(),
        city: string(),
      }),
    })
  )

  expect(data).toStrictEqual({
    name: 'john',
    address: {
      street: '123 Fake St',
      city: 'Springfield',
    },
  })
})
