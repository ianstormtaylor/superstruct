import { expect, test } from 'vitest'
import { func, StructError } from '../../src'
import { print } from '../../src/utils'
import { fixtures } from '../fixtures/fixtures'

test('Functions are considered valid and returned as functions', () => {
  const cases = fixtures.pick(['functions'])

  for (const f of cases) {
    const [error, result] = func().validate(f)

    expect(error).toBeUndefined()
    expect(result).toBe(f)
    expect(f).toBeTypeOf('function')
  }
})

test('Non functions are considered invalid and returned with Error', () => {
  const cases = fixtures.omit(['functions'])

  for (const invalidFunc of cases) {
    const [error, result] = func().validate(invalidFunc)

    expect(result).toBeUndefined()

    expect(error).not.toBeUndefined()
    expect(error).toBeInstanceOf(StructError)
    expect(error?.failures()).toStrictEqual([
      {
        branch: [invalidFunc],
        explanation: undefined,
        key: undefined,
        message: `Expected a function, but received: ${print(invalidFunc)}`,
        path: [],
        refinement: undefined,
        type: 'func',
        value: invalidFunc,
      },
    ])
  }
})
