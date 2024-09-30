import { validate } from '../../../src'
import { expect, test } from 'vitest'
import { set } from '../../../src'

test('Invalid set opaque', () => {
  const data = 'invalid'
  const [err, res] = validate(data, set())
  expect(res).toBeUndefined()

  expect(err).toMatchStructError([
    {
      value: 'invalid',
      type: 'set',
      refinement: undefined,
      path: [],
      branch: [data],
    },
  ])
})
