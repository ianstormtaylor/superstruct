import { expect, test } from 'vitest'
import { integer, StructError } from '../../src'
import { print } from '../../src/utils'
import { fixtures } from '../fixtures/fixtures'

test('Integers are considered valid and returned as a number', () => {
  const cases = fixtures.pick(['integers'])

  for (const num of cases) {
    const [error, result] = integer().validate(num)

    expect(error).toBeUndefined()
    expect(result).toBe(num)
    expect(result).toBeTypeOf('number')
  }
})

test('Non integers are considered invalid and returned with Error', () => {
  const cases = fixtures.omit(['integers'])

  for (const invalidNum of cases) {
    const [error, result] = integer().validate(invalidNum)

    expect(result).toBeUndefined()

    expect(error).not.toBeUndefined()
    expect(error).toBeInstanceOf(StructError)
    expect(error?.failures()).toStrictEqual([
      {
        branch: [invalidNum],
        explanation: undefined,
        key: undefined,
        message: `Expected an integer, but received: ${print(invalidNum)}`,
        path: [],
        refinement: undefined,
        type: 'integer',
        value: invalidNum,
      },
    ])
  }
})
