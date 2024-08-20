import { assert } from '../../../src'
import { expect, test } from 'vitest'
import { object } from '../../../src'

test('Valid object opaque', () => {
  const data = {
    a: 'string',
    b: 42,
  }

  assert(data, object())

  expect(data).toStrictEqual({
    a: 'string',
    b: 42,
  })
})
