import { deepEqual, equal } from 'assert'
import { validate, string, StructError } from '../..'

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
        type: 'string',
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
        type: 'string',
        path: [],
        branch: [42],
      },
    ])
  })
})
