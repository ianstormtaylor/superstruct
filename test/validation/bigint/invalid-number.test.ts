import { validate } from '../../../src'
import { expect, test } from 'vitest'
import { bigint } from '../../../src'

test('Invalid bigint number', () => {
  const data = 3
  const [err, res] = validate(data, bigint())
  expect(res).toBeUndefined()

  expect(err).toMatchStructError([
    {
      value: 3,
      type: 'bigint',
      refinement: undefined,
      path: [],
      branch: [data],
    },
  ])
})
