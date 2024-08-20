import { assert } from '../../../src'
import { expect, test } from 'vitest'
import { type, union, string, number } from '../../../src'

const A = type({ a: string() })
const B = type({ b: number() })

test('Valid union', () => {
  const data = {
    a: 'a',
  }

  assert(data, union([A, B]))

  expect(data).toStrictEqual({
    a: 'a',
  })
})
