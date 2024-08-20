import { validate } from '../../../src'
import { expect, test } from 'vitest'
import { set, number } from '../../../src'

test('Invalid set element', () => {
  const data = new Set([1, 'b', 3])
  const [err, res] = validate(data, set(number()))
  expect(res).toBeUndefined()

  expect(err).toMatchStructError([
    {
      value: 'b',
      type: 'number',
      refinement: undefined,
      path: ['b'],
      branch: [data, 'b'],
    },
  ])
})
