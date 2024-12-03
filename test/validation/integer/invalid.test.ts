import { validate } from '../../../src'
import { expect, test } from 'vitest'
import { integer } from '../../../src'

test('Invalid integer', () => {
  const data = 'invalid'
  const [err, res] = validate(data, integer())
  expect(res).toBeUndefined()

  expect(err).toMatchStructError([
    {
      value: 'invalid',
      type: 'integer',
      refinement: undefined,
      path: [],
      branch: [data],
    },
  ])
})
