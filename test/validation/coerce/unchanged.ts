import { create } from '../../../src'
import { expect, test } from 'vitest'
import { string, unknown, coerce } from '../../../src'

test('Unchanged coerce', () => {
  const data = 'known'

  const res = create(
    data,
    coerce(string(), unknown(), (x) => (x == null ? 'unknown' : x))
  )

  expect(res).toStrictEqual('known')
})
