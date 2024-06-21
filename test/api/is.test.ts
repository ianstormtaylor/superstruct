import { describe, expect, it } from 'vitest'
import { is, string } from '../../src'

describe('is', () => {
  it('valid as helper', () => {
    expect(is('valid', string())).toBe(true)
  })

  it('valid as method', () => {
    expect(string().is('valid')).toBe(true)
  })

  it('invalid as helper', () => {
    expect(is(42, string())).toBe(false)
  })

  it('invalid as method', () => {
    expect(string().is(42)).toBe(false)
  })
})
