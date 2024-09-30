import { assert } from '../../../src'
import { expect, test } from 'vitest'
import { string, empty } from '../../../src'

test('Valid empty string', () => {
  const data = ''
  assert(data, empty(string()))
  expect(data).toStrictEqual('')
})
