import { strictEqual, deepEqual } from 'assert'
import { type, optional, create, string, defaulted } from '../..'

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

  it('optional fields not undefined', () => {
    const S = type({
      a: string(),
      b: optional(string()),
      c: optional(type({ d: string() })),
    })
    deepEqual(S.create({ a: 'a' }), { a: 'a' })
  })
})
