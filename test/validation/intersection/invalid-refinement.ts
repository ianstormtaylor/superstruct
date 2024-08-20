import { validate } from '../../../src'
import { expect, test } from 'vitest'
import { intersection, refine, number } from '../../../src'

const A = number()
const B = refine(number(), 'positive', (value) => value > 0)

test('Invalid intersection refinement', () => {
  const data = -1
  const [err, res] = validate(data, intersection([A, B]))
  expect(res).toBeUndefined()

  expect(err).toMatchStructError([
    {
      type: 'number',
      refinement: 'positive',
      value: -1,
      path: [],
      branch: [data],
    },
  ])
})
