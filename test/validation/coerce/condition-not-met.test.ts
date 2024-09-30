import { validate } from '../../../src'
import { expect, test } from 'vitest'
import { string, number, coerce } from '../../../src'

test('Condition coerce not met', () => {
  const data = false

  const [err, res] = validate(
    data,
    coerce(string(), number(), (x) => 'known'),
    {
      coerce: true,
    }
  )

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
