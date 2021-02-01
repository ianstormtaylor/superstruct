import { strictEqual } from 'assert'
import { create, string, defaulted } from '../..'

describe('create', () => {
  it('missing as helper', () => {
    const S = defaulted(string(), 'default')
    strictEqual(create(undefined, S), 'default')
  })

  it('missing as method', () => {
    const S = defaulted(string(), 'default')
    strictEqual(S.create(undefined), 'default')
  })

  it('not missing as helper', () => {
    const S = defaulted(string(), 'default')
    strictEqual(create('string', S), 'string')
  })

  it('not missing as method', () => {
    const S = defaulted(string(), 'default')
    strictEqual(S.create('string'), 'string')
  })
})
