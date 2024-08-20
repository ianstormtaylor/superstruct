import { validate } from '../../../src'
import { expect, test } from 'vitest'
import { record, string, number } from '../../../src'

test('Invalid record property', () => {
  const data = {
    a: 'a',
    b: 'b',
  }

  const [err, res] = validate(data, record(string(), number()))
  expect(res).toBeUndefined()

  expect(err).toMatchStructError([
    {
      value: 'a',
      type: 'number',
      refinement: undefined,
      path: ['a'],
      branch: [data, data.a],
    },
    {
      value: 'b',
      type: 'number',
      refinement: undefined,
      path: ['b'],
      branch: [data, data.b],
    },
  ])
})
