import { validate } from '../../../src'
import { expect, test } from 'vitest'
import { omit, object, string } from '../../../src'

test('Invalid omit property nested', () => {
  const data = {
    address: {
      street: 123,
      city: 'Springfield',
    },
  }

  const [err, res] = validate(
    data,
    omit(
      object({
        name: string(),
        address: object({
          street: string(),
          city: string(),
        }),
      }),
      ['name']
    )
  )

  expect(res).toBeUndefined()

  expect(err).toMatchStructError([
    {
      value: 123,
      type: 'string',
      refinement: undefined,
      path: ['address', 'street'],
      branch: [data, data.address, data.address.street],
    },
  ])
})
