import { validate } from '../../../src'
import { expect, test } from 'vitest'
import { func } from '../../../src'

test('Invalid function', () => {
  const data = false
  const [err, res] = validate(data, func())
  expect(res).toBeUndefined()

  expect(err).toMatchStructError([
    {
      value: false,
      type: 'func',
      refinement: undefined,
      path: [],
      branch: [data],
    },
  ])
})
