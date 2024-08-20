import { assert } from '../../../src'
import { expect, test } from 'vitest'
import { map, string, number } from '../../../src'

test('Valid map', () => {
  const data = new Map([
    ['a', 1],
    ['b', 2],
  ])

  assert(data, map(string(), number()))

  expect(data).toStrictEqual(
    new Map([
      ['a', 1],
      ['b', 2],
    ])
  )
})
