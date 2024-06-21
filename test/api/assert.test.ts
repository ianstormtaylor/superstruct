import { describe, expect, it } from 'vitest'
import { assert, string, StructError } from '../../src'

describe('assert', () => {
  it('valid as helper', () => {
    expect(() => assert('valid', string())).not.toThrow(StructError)
  })

  it('valid as method', () => {
    expect(() => string().assert('valid')).not.toThrow(StructError)
  })

  it('invalid as helper', () => {
    expect(() => assert(42, string())).toThrow(StructError)
  })

  it('invalid as method', () => {
    expect(() => string().assert(42)).toThrow(StructError)
  })

  it('custom error message', () => {
    expect(() => string().assert(42, 'Not a string!')).toThrow(
      expect.objectContaining({
        cause: 'Expected a string, but received: 42',
        message: 'Not a string!',
      })
    )
  })
})
