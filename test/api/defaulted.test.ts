import { describe, expect, it } from 'vitest'
import {
  any,
  coerce,
  create,
  defaulted,
  number,
  object,
  string,
  validate,
} from '../../src'

describe('defaulted factory evaluation', () => {
  it('does not consume generated identifiers for supplied values', () => {
    let next = 0
    const User = object({ id: defaulted(number(), () => next++) })
    expect(create({ id: 42 }, User)).toStrictEqual({ id: 42 })
    expect(next).toBe(0)
    expect(create({}, User)).toStrictEqual({ id: 0 })
    expect(next).toBe(1)
  })

  it('does not run a throwing factory for a supplied value', () => {
    const S = defaulted(string(), () => {
      throw new Error('unneeded fallback')
    })
    expect(create('provided', S)).toBe('provided')
  })

  it('does not evaluate strict object defaults for supplied objects', () => {
    const S = defaulted(
      object({ name: string() }),
      () => {
        throw new Error('unneeded fallback')
      },
      { strict: true }
    )
    expect(create({ name: 'provided' }, S)).toStrictEqual({ name: 'provided' })
  })

  it('does not evaluate unused defaults for non-plain values', () => {
    let calls = 0
    const S = defaulted(any(), () => {
      calls++
      return 'default'
    })
    const values = [null, false, 0, '', [], new Date(0), () => 1]
    for (const value of values) {
      expect(create(value, S)).toBe(value)
    }
    expect(calls).toBe(0)
  })

  it('reports invalid supplied values without evaluating defaults', () => {
    let calls = 0
    const S = defaulted(number(), () => {
      calls++
      return 1
    })
    const [error] = validate('invalid', S, { coerce: true })
    expect(error?.type).toBe('number')
    expect(error?.value).toBe('invalid')
    expect(calls).toBe(0)
  })

  it('still applies the underlying coercer to supplied values', () => {
    const S = defaulted(coerce(number(), string(), Number), () => {
      throw new Error('unneeded fallback')
    })
    expect(create('42', S)).toBe(42)
  })

  it('evaluates factories once for each undefined input', () => {
    let calls = 0
    const S = defaulted(number(), () => ++calls, { strict: true })
    expect(create(undefined, S)).toBe(1)
    expect(create(undefined, S)).toBe(2)
    expect(calls).toBe(2)
  })

  it('continues evaluating object factories for property defaults', () => {
    let calls = 0
    const S = defaulted(object({ name: string(), count: number() }), () => {
      calls++
      return { name: 'default', count: 1 }
    })
    expect(create({ name: 'provided' }, S)).toStrictEqual({
      name: 'provided',
      count: 1,
    })
    expect(calls).toBe(1)
    expect(create({ name: 'provided', count: 2 }, S)).toStrictEqual({
      name: 'provided',
      count: 2,
    })
    expect(calls).toBe(2)
  })
})
