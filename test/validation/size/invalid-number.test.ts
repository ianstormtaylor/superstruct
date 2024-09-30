import { validate } from '../../../src'
import { expect, test } from 'vitest'
import { number, size } from '../../../src'

test('Invalid size number', () => {
  const data = 0
  const [err, res] = validate(data, size(number(), 1, 5))
  expect(res).toBeUndefined()

  expect(err).toMatchStructError([
    {
      value: 0,
      type: 'number',
      refinement: 'size',
      path: [],
      branch: [data],
    },
  ])
})
