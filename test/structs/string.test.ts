import { expect, test } from 'vitest'
import { string, StructError } from '../../src'
import { print } from '../../src/utils'
import { fixtures } from '../fixtures/fixtures'

test('Strings are considered valid and returned as a string', () => {
  const cases = fixtures.pick(['strings'])

  for (const strings of cases) {
    const [error, result] = string().validate(strings)

    expect(error).toBeUndefined()
    expect(result).toBe(strings)
    expect(result).toBeTypeOf('string')
  }
})

test('Non strings are considered invalid and returned with Error', () => {
  const cases = fixtures.omit(['strings'])

  for (const invalidStrings of cases) {
    const [error, result] = string().validate(invalidStrings)

    expect(result).toBeUndefined()

    expect(error).not.toBeUndefined()
    expect(error).toBeInstanceOf(StructError)
    expect(error?.failures()).toStrictEqual([
      {
        branch: [invalidStrings],
        explanation: undefined,
        key: undefined,
        message: `Expected a string, but received: ${print(invalidStrings)}`,
        path: [],
        refinement: undefined,
        type: 'string',
        value: invalidStrings,
      },
    ])
  }
})
