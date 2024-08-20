import { validate } from '../../../src'
import { expect, test } from 'vitest'
import { date } from '../../../src'

test('Invalid date date', () => {
  const data = new Date('invalid')
  const [err, res] = validate(data, date())
  expect(res).toBeUndefined()

  expect(err).toMatchStructError([
    {
      value: data,
      type: 'date',
      refinement: undefined,
      path: [],
      branch: [data],
    },
  ])
})
