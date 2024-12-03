import { assert } from '../../../src'
import { expect, test } from 'vitest'
import { any } from '../../../src'

test('Valid any undefined', () => {
  const data = undefined
  assert(data, any())
  expect(data).toStrictEqual(undefined)
})
