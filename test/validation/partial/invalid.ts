import { validate } from '../../../src'
import { expect, test } from 'vitest'
import { partial, string, number } from '../../../src'

test('Invalid partial', () => {
  const data = 'invalid'

  const [err, res] = validate(
    data,
    partial({
      name: string(),
      age: number(),
    })
  )

  expect(res).toBeUndefined()

  expect(err).toMatchStructError([
    {
      value: 'invalid',
      type: 'object',
      refinement: undefined,
      path: [],
      branch: [data],
    },
  ])
})
