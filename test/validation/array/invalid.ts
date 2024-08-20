import { validate } from '../../../src'
import { expect, test } from 'vitest'
import { array, number } from '../../../src'

test('Invalid array', () => {
  const data = 'invalid'
  const [err, res] = validate(data, array(number()))
  expect(res).toBeUndefined()

  expect(err).toMatchStructError([
    {
      value: 'invalid',
      type: 'array',
      refinement: undefined,
      path: [],
      branch: [data],
    },
  ])
})
