import { validate } from '../../../src'
import { expect, test } from 'vitest'
import { string, refine } from '../../../src'

test('Invalid refine', () => {
  const data = 'invalid'
  const [err, res] = validate(
    data,
    refine(string(), 'email', (value) => value.includes('@'))
  )
  expect(res).toBeUndefined()

  expect(err).toMatchStructError([
    {
      value: 'invalid',
      type: 'string',
      refinement: 'email',
      path: [],
      branch: [data],
    },
  ])
})
