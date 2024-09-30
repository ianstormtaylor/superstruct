import { assert } from '../../../src'
import { expect, test } from 'vitest'
import { regexp } from '../../../src'

test('Valid regexp', () => {
  const data = /./
  assert(data, regexp())
  expect(data).toStrictEqual(data)
})
