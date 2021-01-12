import { deepStrictEqual, strictEqual } from 'assert'
import { validate, string, StructError, define, refine, object } from '../..'

describe('validate', () => {
  it('valid as helper', () => {
    const S = string()
    deepStrictEqual(validate('valid', S), [undefined, 'valid'])
  })

  it('valid as method', () => {
    const S = string()
    deepStrictEqual(S.validate('valid'), [undefined, 'valid'])
  })

  it('invalid as helper', () => {
    const S = string()
    const [err, value] = validate(42, S)
    strictEqual(value, undefined)
    strictEqual(err instanceof StructError, true)
    deepStrictEqual(Array.from((err as StructError).failures()), [
      {
        value: 42,
        key: undefined,
        type: 'string',
        refinement: undefined,
        message: 'Expected a string, but received: 42',
        path: [],
        branch: [42],
      },
    ])
  })

  it('invalid as method', () => {
    const S = string()
    const [err, value] = S.validate(42)
    strictEqual(value, undefined)
    strictEqual(err instanceof StructError, true)
    deepStrictEqual(Array.from((err as StructError).failures()), [
      {
        value: 42,
        key: undefined,
        type: 'string',
        refinement: undefined,
        message: 'Expected a string, but received: 42',
        path: [],
        branch: [42],
      },
    ])
  })

  it('error message path', () => {
    const S = object({ author: object({ name: string() }) })
    const [err] = S.validate({ author: { name: 42 } })
    strictEqual(
      (err as StructError).message,
      'At path: author.name -- Expected a string, but received: 42'
    )
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
    strictEqual(ranA, true)
    strictEqual(ranB, false)
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
    deepStrictEqual(order, ['validator', 'refiner'])
  })
})
