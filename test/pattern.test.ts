import { object, pattern, string, is } from '../src'
import { describe, expect, it } from 'vitest'

describe('pattern', () => {
  it('runs pattern twice', () => {
    const Query = object({
      url: pattern(string(), /^example/g),
    })

    const testQuery = {
      url: 'example',
    }

    expect(is(testQuery, Query)).toEqual(is(testQuery, Query))
  })
})
