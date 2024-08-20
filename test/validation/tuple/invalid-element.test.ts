import { validate } from '../../../src'
import { expect, test } from 'vitest'
import { tuple, string, number } from '../../../src'

test('Invalid tuple element', () => {
  const data = [false, 3]
  const [err, res] = validate(data, tuple([string(), number()]))
  expect(res).toBeUndefined()

  expect(err).toMatchStructError([
    {
      value: false,
      type: 'string',
      refinement: undefined,
      path: [0],
      branch: [data, data[0]],
    },
  ])
})
