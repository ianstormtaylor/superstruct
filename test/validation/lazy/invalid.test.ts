import { validate } from '../../../src'
import { expect, test } from 'vitest'
import { lazy, string } from '../../../src'

test('Invalid lazy', () => {
  const data = 3
  const [err, res] = validate(
    data,
    lazy(() => string())
  )
  expect(res).toBeUndefined()

  expect(err).toMatchStructError([
    {
      value: 3,
      type: 'string',
      refinement: undefined,
      path: [],
      branch: [data],
    },
  ])
})
