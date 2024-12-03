import { validate } from '../../../src'
import { expect, test } from 'vitest'
import { boolean } from '../../../src'

test('Invalid boolean', () => {
  const data = 'invalid'
  const [err, res] = validate(data, boolean())
  expect(res).toBeUndefined()

  expect(err).toMatchStructError([
    {
      value: 'invalid',
      type: 'boolean',
      refinement: undefined,
      path: [],
      branch: [data],
    },
  ])
})
