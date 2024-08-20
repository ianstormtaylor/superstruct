import { validate } from '../../../src'
import { expect, test } from 'vitest'
import { map, string, number } from '../../../src'

test('Invalid map', () => {
  const data = 'invalid'
  const [err, res] = validate(data, map(string(), number()))
  expect(res).toBeUndefined()

  expect(err).toMatchStructError([
    {
      value: 'invalid',
      type: 'map',
      refinement: undefined,
      path: [],
      branch: [data],
    },
  ])
})
