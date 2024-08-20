import { validate } from '../../../src'
import { expect, test } from 'vitest'
import { object } from '../../../src'

test('Invalid object array', () => {
  const data = []
  const [err, res] = validate(data, object())
  expect(res).toBeUndefined()

  expect(err).toMatchStructError([
    {
      value: [],
      type: 'object',
      refinement: undefined,
      path: [],
      branch: [data],
    },
  ])
})
