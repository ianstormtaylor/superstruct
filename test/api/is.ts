import { equal } from 'assert'
import { is, string } from '../..'

describe('is', () => {
  it('valid as helper', () => {
    equal(is('valid', string()), true)
  })

  it('valid as method', () => {
    equal(string().is('valid'), true)
  })

  it('invalid as helper', () => {
    equal(is(42, string()), false)
  })

  it('invalid as method', () => {
    equal(string().is(42), false)
  })
})
