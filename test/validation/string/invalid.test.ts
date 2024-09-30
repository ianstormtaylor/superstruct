import { validate } from '../../../src'
import { expect, test } from 'vitest'
import { string } from '../../../src'

test('Invalid string', () => {
  const data = false
  const [err, res] = validate(data, string())
  expect(res).toBeUndefined()

  expect(err).toMatchStructError([
    {
      value: false,
      type: 'string',
      refinement: undefined,
      path: [],
      branch: [data],
    },
  ])
})
