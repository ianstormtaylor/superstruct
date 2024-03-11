import { deepStrictEqual, throws } from 'assert'
import {
  mask,
  object,
  string,
  defaulted,
  StructError,
  array,
  type,
  union,
} from '../../src'

describe('mask', () => {
  it('object as helper', () => {
    const S = object({ id: string() })
    const value = { id: '1', unknown: true }
    deepStrictEqual(mask(value, S), { id: '1' })
  })

  it('non-object as helper', () => {
    const S = object({ id: string() })
    const value = 'invalid'
    throws(() => {
      mask(value, S)
    }, StructError)
  })

  it('coercing', () => {
    const S = defaulted(object({ id: string() }), { id: '0' })
    const value = { unknown: true }
    deepStrictEqual(mask(value, S), { id: '0' })
  })

  it('deep masking of objects', () => {
    const S = object({
      id: string(),
      sub: array(object({ prop: string() })),
    })
    const value = {
      id: '1',
      unknown: true,
      sub: [{ prop: '2', unknown: true }],
    }
    deepStrictEqual(mask(value, S), { id: '1', sub: [{ prop: '2' }] })
  })

  it('masking of a nested type', () => {
    const S = object({
      id: string(),
      sub: array(
        type({ prop: string(), defaultedProp: defaulted(string(), '42') })
      ),
      union: array(union([object({ prop: string() }), type({ k: string() })])),
    })
    const value = {
      id: '1',
      unknown: true,
      sub: [{ prop: '2', unknown: true }],
      union: [
        { prop: '3', unknown: true },
        { k: '4', unknown: true },
      ],
    }
    deepStrictEqual(mask(value, S), {
      id: '1',
      sub: [{ prop: '2', unknown: true, defaultedProp: '42' }],
      union: [{ prop: '3' }, { k: '4', unknown: true }],
    })
  })

  it('masking succeeds for objects with extra props in union', () => {
    const S = union([
      object({ a: string(), defaultedProp: defaulted(string(), '42') }),
      object({ b: string() }),
    ])
    const value = { a: '1', extraProp: 42 }
    deepStrictEqual(mask(value, S), { a: '1', defaultedProp: '42' })
  })

  it('masking of a top level type and nested object', () => {
    const S = type({
      id: string(),
      sub: array(object({ prop: string() })),
    })
    const value = {
      id: '1',
      unknown: true,
      sub: [{ prop: '2', unknown: true }],
    }
    deepStrictEqual(mask(value, S), {
      id: '1',
      unknown: true,
      sub: [{ prop: '2' }],
    })
  })

  it('masking does not change the original value', () => {
    const S = object({ id: string() })
    const value = { id: '1', unknown: true }
    deepStrictEqual(mask(value, S), { id: '1' })
    deepStrictEqual(value, { id: '1', unknown: true })
  })

  it('custom error message', () => {
    throws(() => string().mask(42, 'Not a string!'), {
      cause: 'Expected a string, but received: 42',
      message: 'Not a string!',
    })
  })
})
