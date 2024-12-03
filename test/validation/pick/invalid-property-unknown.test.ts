import { validate } from '../../../src'
import { expect, test } from 'vitest'
import { pick, object, string, number } from '../../../src'

test('Invalid pick property unknown', () => {
  const data = {
    name: 'john',
    age: 42,
  }

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
      value: 42,
      type: 'never',
      refinement: undefined,
      path: ['age'],
      branch: [data, data.age],
    },
  ])
})
