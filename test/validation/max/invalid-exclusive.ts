import { validate } from '../../../src'
import { expect, test } from 'vitest'
import { number, max } from '../../../src'

test('Invalid max exclusive', () => {
  const data = 0
  const [err, res] = validate(data, max(number(), 0, { exclusive: true }))
  expect(res).toBeUndefined()

  expect(err).toMatchStructError([
    {
      value: 0,
      type: 'number',
      refinement: 'max',
      path: [],
      branch: [data],
    },
  ])
})
