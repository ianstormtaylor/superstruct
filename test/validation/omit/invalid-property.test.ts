import { validate } from '../../../src'
import { expect, test } from 'vitest'
import { omit, object, string, number } from '../../../src'

test('Invalid omit property', () => {
  const data = {
    age: 'invalid',
  }

  const [err, res] = validate(
    data,
    omit(
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
      type: 'number',
      refinement: undefined,
      path: ['age'],
      branch: [data, data.age],
    },
  ])
})
