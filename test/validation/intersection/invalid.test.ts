import { validate } from '../../../src'
import { expect, test } from 'vitest'
import { type, intersection, string, number } from '../../../src'

const A = type({ a: string() })
const B = type({ b: number() })

test('Invalid intersection', () => {
  const data = {
    a: 'a',
    b: 'invalid',
  }

  const [err, res] = validate(data, intersection([A, B]))
  expect(res).toBeUndefined()

  expect(err).toMatchStructError([
    {
      type: 'number',
      value: 'invalid',
      refinement: undefined,
      path: ['b'],
      branch: [data, data.b],
    },
  ])
})
