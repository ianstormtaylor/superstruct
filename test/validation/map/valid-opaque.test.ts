import { assert } from '../../../src'
import { expect, test } from 'vitest'
import { map } from '../../../src'

test('Valid map opaque', () => {
  const data = new Map([
    ['a', 1],
    [2, true],
  ] as any)

  assert(data, map())

  expect(data).toStrictEqual(
    new Map([
      ['a', 1],
      [2, true],
    ] as any)
  )
})
