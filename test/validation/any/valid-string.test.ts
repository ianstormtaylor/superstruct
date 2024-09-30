import { assert } from '../../../src'
import { expect, test } from 'vitest'
import { any } from '../../../src'

test('Valid any string', () => {
  const data = 'valid'
  assert(data, any())
  expect(data).toStrictEqual('valid')
})
