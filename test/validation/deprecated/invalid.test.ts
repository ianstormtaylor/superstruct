import { validate } from '../../../src'
import { expect, test } from 'vitest'
import { deprecated, number } from '../../../src'

test('Invalid deprecated', () => {
  const data = '42'
  const [err, res] = validate(
    data,
    deprecated(number(), () => {})
  )
  expect(res).toBeUndefined()

  expect(err).toMatchStructError([
    {
      value: '42',
      type: 'number',
      refinement: undefined,
      path: [],
      branch: [data],
    },
  ])
})
