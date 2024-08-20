import { validate } from '../../../src'
import { expect, test } from 'vitest'
import { number, min } from '../../../src'

test('Invalid min', () => {
  const data = -1
  const [err, res] = validate(data, min(number(), 0))
  expect(res).toBeUndefined()

  expect(err).toMatchStructError([
    {
      value: -1,
      type: 'number',
      refinement: 'min',
      path: [],
      branch: [data],
    },
  ])
})
