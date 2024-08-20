import { assert } from '../../../src'
import { expect, test } from 'vitest'
import { pick, object, string } from '../../../src'

test('Valid pick nested', () => {
  const data = {
    address: {
      street: '123 Fake St',
      city: 'Springfield',
    },
  }

  assert(
    data,
    pick(
      object({
        name: string(),
        address: object({
          street: string(),
          city: string(),
        }),
      }),
      ['address']
    )
  )

  expect(data).toStrictEqual({
    address: {
      street: '123 Fake St',
      city: 'Springfield',
    },
  })
})
