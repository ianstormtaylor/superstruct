import { validate } from '../../../src'
import { expect, test } from 'vitest'
import { array } from '../../../src'

test('Invalid array opaque', () => {
  const data = 'invalid'
  const [err, res] = validate(data, array())
  expect(res).toBeUndefined()

  expect(err).toMatchStructError([
    {
      value: 'invalid',
      type: 'array',
      refinement: undefined,
      path: [],
      branch: [data],
    },
  ])
})
