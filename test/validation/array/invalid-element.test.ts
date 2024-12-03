import { validate } from '../../../src'
import { expect, test } from 'vitest'
import { array, number } from '../../../src'

test('Invalid array element', () => {
  const data = [1, 'invalid', 3]
  const [err, res] = validate(data, array(number()))
  expect(res).toBeUndefined()

  expect(err).toMatchStructError([
    {
      value: 'invalid',
      type: 'number',
      refinement: undefined,
      path: [1],
      branch: [data, data[1]],
    },
  ])
})
