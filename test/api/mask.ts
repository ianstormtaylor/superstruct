import { deepStrictEqual, throws } from 'assert'
import { mask, object, string, defaulted, StructError } from '../..'

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
})
