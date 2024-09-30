import { validate } from '../../../src'
import { expect, test } from 'vitest'
import { number } from '../../../src'

test('Invalid number', () => {
  const data = 'invalid'
  const [err, res] = validate(data, number())
  expect(res).toBeUndefined()

  expect(err).toMatchStructError([
    {
      value: 'invalid',
      type: 'number',
      refinement: undefined,
      path: [],
      branch: [data],
    },
  ])
})
