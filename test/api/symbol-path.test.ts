import { describe, expect, it } from 'vitest'
import {
  any,
  array,
  assert,
  is,
  map,
  number,
  object,
  string,
  StructError,
  validate,
} from '../../src'

describe('symbol paths', () => {
  it('returns an error for an invalid value at a symbol map key', () => {
    const key = Symbol('key')
    const data = new Map([[key, 42]])
    const [error, value] = validate(data, map(any(), string()))
    expect(value).toBeUndefined()
    expect(error).toBeInstanceOf(StructError)
    expect(error?.message).toBe(
      'At path: Symbol(key) -- Expected a string, but received: 42'
    )
    expect(error?.path).toStrictEqual([key])
    expect(error?.key).toBe(key)
  })

  it('returns an error for an invalid symbol map key', () => {
    const key = Symbol('key')
    const [error] = validate(new Map([[key, 42]]), map(string(), number()))
    expect(error).toBeInstanceOf(StructError)
    expect(error?.message).toBe(
      'At path: Symbol(key) -- Expected a string, but received: Symbol(key)'
    )
    expect(error?.path).toStrictEqual([key])
  })

  it('formats symbols in nested paths without changing the path', () => {
    const key = Symbol()
    const data = { records: [new Map([[key, 42]])] }
    const [error] = validate(
      data,
      object({ records: array(map(any(), string())) })
    )
    expect(error?.message).toBe(
      'At path: records.0.Symbol() -- Expected a string, but received: 42'
    )
    expect(error?.path).toStrictEqual(['records', 0, key])
  })

  it('returns false from is instead of throwing for a symbol path', () => {
    expect(is(new Map([[Symbol('key'), 42]]), map(any(), string()))).toBe(false)
  })

  it('throws a StructError from assert for a symbol path', () => {
    expect(() =>
      assert(new Map([[Symbol('key'), 42]]), map(any(), string()))
    ).toThrow(StructError)
  })

  it('preserves custom error messages and the symbol path in the cause', () => {
    const [error] = validate(
      new Map([[Symbol('key'), 42]]),
      map(any(), string()),
      { message: 'Invalid map' }
    )
    expect(error?.message).toBe('Invalid map')
    expect(error?.cause).toBe(
      'At path: Symbol(key) -- Expected a string, but received: 42'
    )
  })

  it('retains symbol identity in all failures', () => {
    const first = Symbol('key')
    const second = Symbol('key')
    const [error] = validate(
      new Map([
        [first, 1],
        [second, 2],
      ]),
      map(any(), string())
    )
    expect(error?.failures().map((failure) => failure.path)).toStrictEqual([
      [first],
      [second],
    ])
  })

  it('continues accepting valid symbol-keyed maps', () => {
    const data = new Map([[Symbol('key'), 'value']])
    expect(validate(data, map(any(), string()))).toStrictEqual([
      undefined,
      data,
    ])
  })
})
