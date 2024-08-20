import { validate } from '../../../src'
import { expect, test } from 'vitest'
import { pick, object, string, number } from '../../../src'

test('Invalid pick', () => {
  const data = 'invalid'

  const [err, res] = validate(
    data,
    pick(
      object({
        name: string(),
        age: number(),
      }),
      ['name']
    )
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
