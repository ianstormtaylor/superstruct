import { validate } from '../../../src'
import { expect, test } from 'vitest'
import { object, string, number } from '../../../src'

test('Invalid object property unknown', () => {
  const data = {
    name: 'john',
    age: 42,
    unknown: true,
  }

  const [err, res] = validate(
    data,
    object({
      name: string(),
      age: number(),
    })
  )

  expect(res).toBeUndefined()

  expect(err).toMatchStructError([
    {
      value: true,
      type: 'never',
      refinement: undefined,
      path: ['unknown'],
      branch: [data, data.unknown],
    },
  ])
})
