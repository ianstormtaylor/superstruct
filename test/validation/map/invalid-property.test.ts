import { validate } from '../../../src'
import { expect, test } from 'vitest'
import { map, string, number } from '../../../src'

test('Invalid map property', () => {
  const data = new Map([
    ['a', 'a'],
    ['b', 'b'],
  ])

  const [err, res] = validate(data, map(string(), number()))
  expect(res).toBeUndefined()

  expect(err).toMatchStructError([
    {
      value: 'a',
      type: 'number',
      refinement: undefined,
      path: ['a'],
      branch: [data, 'a'],
    },
    {
      value: 'b',
      type: 'number',
      refinement: undefined,
      path: ['b'],
      branch: [data, 'b'],
    },
  ])
})
