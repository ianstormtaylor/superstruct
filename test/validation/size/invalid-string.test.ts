import { validate } from '../../../src'
import { expect, test } from 'vitest'
import { string, size } from '../../../src'

test('Invalid size string', () => {
  const data = ''
  const [err, res] = validate(data, size(string(), 1, 5))
  expect(res).toBeUndefined()

  expect(err).toMatchStructError([
    {
      value: '',
      type: 'string',
      refinement: 'size',
      path: [],
      branch: [data],
    },
  ])
})
