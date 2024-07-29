import { expect, test } from 'vitest'
import { boolean, StructError } from '../../src'
import { print } from '../../src/utils'
import { fixtures } from '../fixtures/fixtures'

test('Booleans are considered valid and returned as a boolean', () => {
  const cases = fixtures.pick(['booleans'])

  for (const bool of cases) {
    const [error, result] = boolean().validate(bool)

    expect(error).toBeUndefined()
    expect(result).toBe(bool)
    expect(result).toBeTypeOf('boolean')
  }
})

test('Non booleans are considered invalid and returned with Error', () => {
  const cases = fixtures.omit(['booleans'])

  for (const invalidBool of cases) {
    const [error, result] = boolean().validate(invalidBool)

    expect(result).toBeUndefined()

    expect(error).not.toBeUndefined()
    expect(error).toBeInstanceOf(StructError)
    expect(error?.failures()).toStrictEqual([
      {
        branch: [invalidBool],
        explanation: undefined,
        key: undefined,
        message: `Expected a value of type \`boolean\`, but received: \`${print(invalidBool)}\``,
        path: [],
        refinement: undefined,
        type: 'boolean',
        value: invalidBool,
      },
    ])
  }
})
