import { validate } from '../../../src'
import { expect, test } from 'vitest'
import { number, min } from '../../../src'

test('Invalid min exclusive', () => {
  const data = 0
  const [err, res] = validate(data, min(number(), 0, { exclusive: true }))
  expect(res).toBeUndefined()

  expect(err).toMatchStructError([
    {
      value: 0,
      type: 'number',
      refinement: 'min',
      path: [],
      branch: [data],
    },
  ])
})
