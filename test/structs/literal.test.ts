import { expect, test } from 'vitest'
import { literal, StructError } from '../../src'
import { print } from '../../src/utils'
import { fixtures } from '../fixtures/fixtures'

test('Literal is only considered valid and returned', () => {
  const [error, result] = literal(42).validate(42)

  expect(error).toBeUndefined()
  expect(result).toBe(42)
  expect(result).toBeTypeOf('number')
})

test('Non integers are considered invalid and returned with Error', () => {
  const cases = fixtures.all()

  for (const invalidLiteral of cases) {
    const [error, result] = literal(42).validate(invalidLiteral)

    expect(result).toBeUndefined()

    expect(error).not.toBeUndefined()
    expect(error).toBeInstanceOf(StructError)
    expect(error?.failures()).toStrictEqual([
      {
        branch: [invalidLiteral],
        explanation: undefined,
        key: undefined,
        message: `Expected the literal \`42\`, but received: ${print(invalidLiteral)}`,
        path: [],
        refinement: undefined,
        type: 'literal',
        value: invalidLiteral,
      },
    ])
  }
})
