import { deepEqual, equal } from 'assert'
import { validate, string, StructError, struct, object, array } from '../..'

describe('validate', () => {
  it('valid as helper', () => {
    const S = string()
    deepEqual(validate('valid', S), [undefined, 'valid'])
  })

  it('valid as method', () => {
    const S = string()
    deepEqual(S.validate('valid'), [undefined, 'valid'])
  })

  it('invalid as helper', () => {
    const S = string()
    const [err, value] = validate(42, S)
    equal(value, undefined)
    equal(err instanceof StructError, true)
    deepEqual(Array.from((err as StructError).failures()), [
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
    equal(value, undefined)
    equal(err instanceof StructError, true)
    deepEqual(Array.from((err as StructError).failures()), [
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
    const S = array(string())
    const [err] = S.validate(['a', 42])
    equal(
      (err as StructError).message,
      'At path: 1 -- Expected a string, but received: 42'
    )
  })

  it('early exit', () => {
    let ranA = false
    let ranB = false

    const A = struct('A', (x) => {
      ranA = true
      return typeof x === 'string'
    })

    const B = struct('B', (x) => {
      ranA = true
      return typeof x === 'string'
    })

    const S = object({ a: A, b: B })
    S.validate({ a: null, b: null })
    equal(ranA, true)
    equal(ranB, false)
  })
})
