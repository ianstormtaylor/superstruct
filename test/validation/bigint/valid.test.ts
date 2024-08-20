import { assert } from '../../../src'
import { expect, test } from 'vitest'
import { bigint } from '../../../src'

test('Valid bigint', () => {
  const data = 542n
  assert(data, bigint())
  expect(data).toStrictEqual(542n)
})
