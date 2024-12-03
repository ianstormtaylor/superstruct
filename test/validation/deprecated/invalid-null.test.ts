import { validate } from '../../../src'
import { expect, test } from 'vitest'
import { deprecated, string } from '../../../src'

test('Invalid deprecated null', () => {
  const data = null
  const [err, res] = validate(
    data,
    deprecated(string(), () => {})
  )
  expect(res).toBeUndefined()

  expect(err).toMatchStructError([
    {
      value: null,
      type: 'string',
      refinement: undefined,
      path: [],
      branch: [data],
    },
  ])
})
