import { describe, expect, it } from 'vitest'
import {
  type,
  optional,
  create,
  string,
  defaulted,
  literal,
  coerce,
} from '../../src'

describe('create', () => {
  it('missing as helper', () => {
    const S = defaulted(string(), 'default')
    expect(create(undefined, S)).toBe('default')
  })

  it('missing as method', () => {
    const S = defaulted(string(), 'default')
    expect(S.create(undefined)).toBe('default')
  })

  it('not missing as helper', () => {
    const S = defaulted(string(), 'default')
    expect(create('string', S)).toBe('string')
  })

  it('not missing as method', () => {
    const S = defaulted(string(), 'default')
    expect(S.create('string')).toBe('string')
  })

  it('missing optional fields remain missing', () => {
    const S = type({
      a: string(),
      b: optional(string()),
      c: optional(type({ d: string() })),
    })
    expect(S.create({ a: 'a' })).toStrictEqual({ a: 'a' })
  })

  it('explicit undefined values are kept', () => {
    const S = type({
      a: string(),
      b: coerce(optional(string()), literal(null), () => undefined),
      c: optional(type({ d: string() })),
    })
    expect(S.create({ a: 'a', b: null, c: undefined })).toStrictEqual({
      a: 'a',
      b: undefined,
      c: undefined,
    })
  })

  it('custom error message', () => {
    expect(() => string().create(42, 'Not a string!')).toThrow(
      expect.objectContaining({
        cause: 'Expected a string, but received: 42',
        message: 'Not a string!',
      })
    )
  })
})
