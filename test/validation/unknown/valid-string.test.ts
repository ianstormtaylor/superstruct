import { assert } from '../../../src'
import { expect, test } from 'vitest'
import { unknown } from '../../../src'

test('Valid unknown string', () => {
  const data = 'valid'
  assert(data, unknown())
  expect(data).toStrictEqual('valid')
})
