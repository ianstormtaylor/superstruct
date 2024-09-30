import { validate } from '../../../src'
import { expect, test } from 'vitest'
import { type, string, number } from '../../../src'

test('Invalid type property nested', () => {
  const data = {
    id: 1,
  }

  const [err, res] = validate(
    data,
    type({
      id: number(),
      person: type({
        name: string(),
        age: number(),
      }),
    })
  )

  expect(res).toBeUndefined()

  expect(err).toMatchStructError([
    {
      value: undefined,
      type: 'type',
      refinement: undefined,
      path: ['person'],
      branch: [data, undefined],
    },
  ])
})
