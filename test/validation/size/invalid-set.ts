import { validate } from '../../../src'
import { expect, test } from 'vitest'
import { set, size, number } from '../../../src'

test('Invalid size set', () => {
  const data = new Set()
  const [err, res] = validate(data, size(set(number()), 1, 5))
  expect(res).toBeUndefined()

  expect(err).toMatchStructError([
    {
      value: data,
      type: 'set',
      refinement: 'size',
      path: [],
      branch: [data],
    },
  ])
})
