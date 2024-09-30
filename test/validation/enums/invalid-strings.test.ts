import { validate } from '../../../src'
import { expect, test } from 'vitest'
import { enums } from '../../../src'

test('Invalid enums strings', () => {
  const data = 'invalid'
  const [err, res] = validate(data, enums(['one', 'two']))
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
