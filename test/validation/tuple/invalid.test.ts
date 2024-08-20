import { validate } from '../../../src'
import { expect, test } from 'vitest'
import { tuple, string, number } from '../../../src'

test('Invalid tuple', () => {
  const data = 'invalid'
  const [err, res] = validate(data, tuple([string(), number()]))
  expect(res).toBeUndefined()

  expect(err).toMatchStructError([
    {
      value: 'invalid',
      type: 'tuple',
      refinement: undefined,
      path: [],
      branch: [data],
    },
  ])
})
