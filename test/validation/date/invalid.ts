import { validate } from '../../../src'
import { expect, test } from 'vitest'
import { date } from '../../../src'

test('Invalid date', () => {
  const data = 'invalid'
  const [err, res] = validate(data, date())
  expect(res).toBeUndefined()

  expect(err).toMatchStructError([
    {
      value: 'invalid',
      type: 'date',
      refinement: undefined,
      path: [],
      branch: [data],
    },
  ])
})
