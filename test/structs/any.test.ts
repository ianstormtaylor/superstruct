import { expect, test } from 'vitest'
import { fixtures } from '../fixtures/fixtures'
import { any } from '../../src'

test('Everything is considered valid and returned as anything', () => {
  const cases = fixtures.all()

  for (const c of cases) {
    const [error, result] = any().validate(c)

    expect(error).toBeUndefined()
    expect(result).toBe(c)
    expect(result).toBeTypeOf(typeof c)
  }
})
