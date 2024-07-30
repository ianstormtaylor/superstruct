import { expect, test } from 'vitest'
import { fixtures } from '../fixtures/fixtures'
import { unknown } from '../../src'

test('Everything is considered valid and returned as unknown', () => {
  const cases = fixtures.all()

  for (const c of cases) {
    const [error, result] = unknown().validate(c)

    expect(error).toBeUndefined()
    expect(result).toBe(c)
  }
})
