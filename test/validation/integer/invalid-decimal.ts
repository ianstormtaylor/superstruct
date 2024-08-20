import { validate } from '../../../src'
import { expect, test } from 'vitest'
import { integer } from '../../../src'

test('Invalid integer decimal', () => {
  const data = 3.14
  const [err, res] = validate(data, integer())
  expect(res).toBeUndefined()

  expect(err).toMatchStructError([
    {
      value: 3.14,
      type: 'integer',
      refinement: undefined,
      path: [],
      branch: [data],
    },
  ])
})
