import { describe, expect, it } from 'vitest'
import {
  validate,
  string,
  StructError,
  Struct,
  define,
  refine,
  object,
  any,
} from '../../src'

describe('validate', () => {
  it('valid as helper', () => {
    const S = string()
    expect(validate('valid', S)).toStrictEqual([undefined, 'valid'])
  })

  it('valid as method', () => {
    const S = string()
    expect(S.validate('valid')).toStrictEqual([undefined, 'valid'])
  })

  it('invalid as helper', () => {
    const S = string()
    const [err, value] = validate(42, S)
    expect(value).toStrictEqual(undefined)
    expect(err).toBeInstanceOf(StructError)
    expect(Array.from((err as StructError).failures())).toStrictEqual([
      {
        value: 42,
        key: undefined,
        type: 'string',
        refinement: undefined,
        message: 'Expected a string, but received: 42',
        path: [],
        branch: [42],
        explanation: undefined,
      },
    ])
  })

  it('invalid as method', () => {
    const S = string()
    const [err, value] = S.validate(42)
    expect(value).toStrictEqual(undefined)
    expect(err).toBeInstanceOf(StructError)
    expect(Array.from((err as StructError).failures())).toStrictEqual([
      {
        value: 42,
        key: undefined,
        type: 'string',
        refinement: undefined,
        message: 'Expected a string, but received: 42',
        path: [],
        branch: [42],
        explanation: undefined,
      },
    ])
  })

  it('error message path', () => {
    const S = object({ author: object({ name: string() }) })
    const [err] = S.validate({ author: { name: 42 } })
    expect(err?.message).toBe(
      'At path: author.name -- Expected a string, but received: 42'
    )
  })

  it('custom error message', () => {
    const S = string()
    const [err] = S.validate(42, { message: 'Validation failed!' })
    expect(err?.message).toBe('Validation failed!')
    expect(err?.cause).toBe('Expected a string, but received: 42')
  })

  it('early exit', () => {
    let ranA = false
    let ranB = false

    const A = define('A', (x) => {
      ranA = true
      return typeof x === 'string'
    })

    const B = define('B', (x) => {
      ranA = true
      return typeof x === 'string'
    })

    const S = object({ a: A, b: B })
    S.validate({ a: null, b: null })
    expect(ranA).toBe(true)
    expect(ranB).toBe(false)
  })

  it('refiners after children', () => {
    const order: string[] = []

    const A = define('A', () => {
      order.push('validator')
      return true
    })

    const B = refine(object({ a: A }), 'B', () => {
      order.push('refiner')
      return true
    })

    B.validate({ a: null })
    expect(order).toStrictEqual(['validator', 'refiner'])
  })

  it('refiners even if nested refiners fail', () => {
    let ranOuterRefiner = false

    const A = refine(any(), 'A', () => {
      return 'inner refiner failed'
    })

    const B = refine(object({ a: A }), 'B', () => {
      ranOuterRefiner = true
      return true
    })

    const [error] = B.validate({ a: null })
    // Collect all failures. Ensures all validation runs.
    error?.failures()
    expect(ranOuterRefiner).toBe(true)
  })

  it('skips refiners if validators return errors', () => {
    let ranRefiner = false

    const A = define('A', () => {
      return false
    })

    const B = refine(object({ a: A }), 'B', () => {
      ranRefiner = true
      return true
    })

    const [error] = B.validate({ a: null })
    // Collect all failures. Ensures all validation runs.
    error?.failures()
    expect(ranRefiner).toBe(false)
  })

  for (const reverse of [false, true]) {
    for (const coerce of [false, true]) {
      it(`skips refiners after mixed child failures (reverse=${reverse}, coerce=${coerce})`, () => {
        let ranRefiner = false
        const name = string()
        const password = refine(
          string(),
          'length',
          (value) => value.length >= 8
        )
        const schema = reverse ? { password, name } : { name, password }
        const S = refine(object(schema), 'outer', (value) => {
          ranRefiner = true
          return value.name.toUpperCase() !== value.password.toUpperCase()
        })
        const [error] = S.validate(
          { name: null, password: 'short' },
          { coerce }
        )

        expect(error).toBeInstanceOf(StructError)
        expect(() => error?.failures()).not.toThrow()
        const failures = error?.failures()
        expect(failures?.map((failure) => failure.path)).toStrictEqual(
          reverse ? [['password'], ['name']] : [['name'], ['password']]
        )
        expect(error?.failures()).toBe(failures)
        expect(ranRefiner).toBe(false)
      })
    }
  }

  it('keeps an own validator failure after a nested refinement failure', () => {
    let ranRefiner = false
    const shape = object({ value: refine(string(), 'child', () => false) })
    const S = refine(
      new Struct({ ...shape, validator: () => false }),
      'outer',
      () => {
        ranRefiner = true
        return true
      }
    )
    const [error] = S.validate({ value: 'valid type' })

    expect(error?.failures().map((failure) => failure.path)).toStrictEqual([
      [],
      ['value'],
    ])
    expect(ranRefiner).toBe(false)
  })

  it('skips ancestor refiners after mixed descendant failures', () => {
    const refiners: string[] = []
    const Child = refine(
      object({
        name: string(),
        password: refine(string(), 'length', () => false),
      }),
      'child',
      () => {
        refiners.push('child')
        return true
      }
    )
    const Parent = refine(object({ child: Child }), 'parent', () => {
      refiners.push('parent')
      return true
    })
    const [error] = Parent.validate({
      child: { name: null, password: 'short' },
    })

    expect(error?.failures()).toHaveLength(2)
    expect(refiners).toStrictEqual([])
  })

  it('still collects parent refinements when every child type is valid', () => {
    const S = refine(
      object({
        first: refine(string(), 'first', () => false),
        second: refine(string(), 'second', () => false),
      }),
      'parent',
      () => false
    )
    const [error] = S.validate({ first: 'one', second: 'two' })

    expect(
      error?.failures().map((failure) => failure.refinement)
    ).toStrictEqual(['first', 'second', 'parent'])
  })
})
