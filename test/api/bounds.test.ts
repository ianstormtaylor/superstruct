import { describe, expect, it } from 'vitest'
import { date, is, max, min, number, object, validate } from '../../src'

for (const bound of ['min', 'max'] as const) {
  describe(`${bound} error messages`, () => {
    const refine = bound === 'min' ? min : max
    const direction = bound === 'min' ? 'greater' : 'less'
    const value = bound === 'min' ? 9 : 11

    for (const exclusive of [true, false]) {
      const comparison = `${direction} than ${exclusive ? '' : 'or equal to '}`

      it(`describes the number bound with exclusive=${exclusive}`, () => {
        const [error] = validate(value, refine(number(), 10, { exclusive }))
        const message = `Expected a number ${comparison}10 but received \`${value}\``
        expect(error?.message).toBe(message)
        expect(error?.failures()[0].message).toBe(message)
      })

      it(`describes the date bound with exclusive=${exclusive}`, () => {
        const threshold = new Date(10)
        const received = new Date(value)
        const [error] = validate(
          received,
          refine(date(), threshold, { exclusive })
        )
        const message = `Expected a date ${comparison}${threshold} but received \`${received}\``
        expect(error?.message).toBe(message)
        expect(error?.failures()[0].message).toBe(message)
      })
    }

    it('preserves the comparison at the boundary', () => {
      expect(is(10, refine(number(), 10))).toBe(true)
      expect(is(10, refine(number(), 10, { exclusive: true }))).toBe(false)
      expect(is(new Date(10), refine(date(), new Date(10)))).toBe(true)
      expect(
        is(new Date(10), refine(date(), new Date(10), { exclusive: true }))
      ).toBe(false)
    })

    it('keeps the bound in the cause of a custom nested error', () => {
      const [error] = validate(
        { value },
        object({ value: refine(number(), 10, { exclusive: true }) }),
        { message: 'Invalid value' }
      )
      expect(error?.message).toBe('Invalid value')
      expect(error?.cause).toBe(
        `At path: value -- Expected a number ${direction} than 10 but received \`${value}\``
      )
    })
  })
}
