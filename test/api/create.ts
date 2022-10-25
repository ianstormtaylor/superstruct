import { strictEqual, deepEqual, deepStrictEqual } from 'assert'
import {
  type,
  optional,
  create,
  string,
  defaulted,
  literal,
  coerce,
} from '../../src'

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

  it('missing optional fields remain missing', () => {
    const S = type({
      a: string(),
      b: optional(string()),
      c: optional(type({ d: string() })),
    })
    deepEqual(S.create({ a: 'a' }), { a: 'a' })
  })

  it('explicit undefined values are kept', () => {
    const S = type({
      a: string(),
      b: coerce(optional(string()), literal(null), () => undefined),
      c: optional(type({ d: string() })),
    })
    deepStrictEqual(S.create({ a: 'a', b: null, c: undefined }), {
      a: 'a',
      b: undefined,
      c: undefined,
    })
  })
})
