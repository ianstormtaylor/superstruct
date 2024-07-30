import { expect, test } from 'vitest'
import { number, StructError } from '../../src'
import { print } from '../../src/utils'
import { fixtures } from '../fixtures/fixtures'

test('Numbers are considered valid and returned as a number', () => {
  const cases = fixtures.pick(['floats', 'integers'])

  for (const num of cases) {
    const [error, result] = number().validate(num)

    expect(error).toBeUndefined()
    expect(result).toBe(num)
    expect(result).toBeTypeOf('number')
  }
})

test('Non numbers are considered invalid and returned with Error', () => {
  const cases = fixtures.omit(['floats', 'integers'])

  for (const invalidNum of cases) {
    const [error, result] = number().validate(invalidNum)

    expect(result).toBeUndefined()

    expect(error).not.toBeUndefined()
    expect(error).toBeInstanceOf(StructError)
    expect(error?.failures()).toStrictEqual([
      {
        branch: [invalidNum],
        explanation: undefined,
        key: undefined,
        message: `Expected a number, but received: ${print(invalidNum)}`,
        path: [],
        refinement: undefined,
        type: 'number',
        value: invalidNum,
      },
    ])
  }
})
