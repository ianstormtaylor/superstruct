import { equal } from 'assert'
import { coerce, string, defaulted } from '../..'

describe('coerce', () => {
  it('missing as helper', () => {
    const S = defaulted(string(), 'default')
    equal(coerce(undefined, S), 'default')
  })

  it('missing as method', () => {
    const S = defaulted(string(), 'default')
    equal(S.coerce(undefined), 'default')
  })

  it('not missing as helper', () => {
    const S = defaulted(string(), 'default')
    equal(coerce('string', S), 'string')
  })

  it('not missing as method', () => {
    const S = defaulted(string(), 'default')
    equal(S.coerce('string'), 'string')
  })
})
