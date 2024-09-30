import { validate } from '../../../src'
import { expect, test } from 'vitest'
import { enums } from '../../../src'

test('Invalid enums numbers', () => {
  const data = 'invalid'
  const [err, res] = validate(data, enums([1, 2]))
  expect(res).toBeUndefined()

  expect(err).toMatchStructError([
    {
      value: 'invalid',
      type: 'enums',
      refinement: undefined,
      path: [],
      branch: [data],
    },
  ])
})
