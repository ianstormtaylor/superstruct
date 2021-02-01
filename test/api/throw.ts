import { deepStrictEqual, strictEqual } from 'assert'
import { StructError, define } from '../..'

describe('throw errors', () => {
  it('throw error in define', () => {
    const S = define<string>('email', () => {
      throw Error('validation error')
    })
    const [err, value] = S.validate(null)
    strictEqual(value, undefined)
    strictEqual(err instanceof StructError, true)
    deepStrictEqual(Array.from(err!.failures()), [
      {
        value: null,
        key: undefined,
        type: 'email',
        refinement: undefined,
        message: 'Throw error in run validation: `Error: validation error`',
        path: [],
        branch: [null],
        detail: {
          class: 'throw',
          error: new Error('validation error'),
          message: 'Throw error in run validation: `Error: validation error`',
        },
      },
    ])
  })
})
