import { throws, doesNotThrow } from 'assert'
import { assert, string, StructError } from '../..'

describe('assert', () => {
  it('valid as helper', () => {
    doesNotThrow(() => {
      assert('valid', string())
    })
  })

  it('valid as method', () => {
    doesNotThrow(() => {
      // @ts-ignore
      string().assert('valid')
    })
  })

  it('invalid as helper', () => {
    throws(() => {
      assert(42, string())
    }, StructError)
  })

  it('invalid as method', () => {
    throws(() => {
      // @ts-ignore
      string().assert(42)
    }, StructError)
  })
})
