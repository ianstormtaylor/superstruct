import { validate } from '../../../src'
import { expect, test } from 'vitest'
import { number, refine } from '../../../src'

test('Invalid refine shorthand', () => {
  const data = -1

  const [err, res] = validate(
    data,
    refine(number(), 'positive', (v) => v > 0 || 'Number was not positive!')
  )

  expect(res).toBeUndefined()

  expect(err).toMatchStructError([
    {
      value: -1,
      type: 'number',
      refinement: 'positive',
      path: [],
      branch: [data],
    },
  ])
})
