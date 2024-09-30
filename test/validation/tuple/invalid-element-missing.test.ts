import { validate } from '../../../src'
import { expect, test } from 'vitest'
import { tuple, string, number } from '../../../src'

test('Invalid tuple element missing', () => {
  const data = ['A']
  const [err, res] = validate(data, tuple([string(), number()]))
  expect(res).toBeUndefined()

  expect(err).toMatchStructError([
    {
      value: undefined,
      type: 'number',
      refinement: undefined,
      path: [1],
      branch: [data, data[1]],
    },
  ])
})
