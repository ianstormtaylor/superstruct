import { deepStrictEqual, throws } from 'assert'
import {
  mask,
  object,
  string,
  defaulted,
  StructError,
  array,
  type,
} from '../..'

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
      sub: array(type({ prop: string() })),
    })
    const value = {
      id: '1',
      unknown: true,
      sub: [{ prop: '2', unknown: true }],
    }
    deepStrictEqual(mask(value, S), {
      id: '1',
      sub: [{ prop: '2', unknown: true }],
    })
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
})
