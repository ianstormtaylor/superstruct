import { describe, it } from 'vitest'
import { strictEqual } from 'assert'
import { is, string } from '../../src'

describe('is', () => {
  it('valid as helper', () => {
    strictEqual(is('valid', string()), true)
  })

  it('valid as method', () => {
    strictEqual(string().is('valid'), true)
  })

  it('invalid as helper', () => {
    strictEqual(is(42, string()), false)
  })

  it('invalid as method', () => {
    strictEqual(string().is(42), false)
  })
})
