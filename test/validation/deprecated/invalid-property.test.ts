import { validate } from '../../../src'
import { expect, test } from 'vitest'
import { deprecated, number, object } from '../../../src'

test('Invalid deprecated property', () => {
  const data = {
    deprecatedKey: '42',
  }

  const [err, res] = validate(
    data,
    object({
      deprecatedKey: deprecated(number(), () => {}),
    })
  )

  expect(res).toBeUndefined()

  expect(err).toMatchStructError([
    {
      value: '42',
      type: 'number',
      refinement: undefined,
      path: ['deprecatedKey'],
      branch: [data, data.deprecatedKey],
    },
  ])
})
