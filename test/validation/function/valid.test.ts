import { assert } from '../../../src'
import { expect, test } from 'vitest'
import { func } from '../../../src'

test('Valid function', () => {
  const data = function () {}
  assert(data, func())
  expect(data).toStrictEqual(data)
})
