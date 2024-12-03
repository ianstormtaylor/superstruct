import { validate } from '../../../src'
import { expect, test } from 'vitest'
import { map } from '../../../src'

test('Invalid map opaque', () => {
  const data = 'invalid'
  const [err, res] = validate(data, map())
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
