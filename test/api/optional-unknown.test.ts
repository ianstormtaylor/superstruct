import { describe, expect, it } from 'vitest'
import { create, is, object, optional, string, type, unknown } from '../../src'

for (const factory of [object, type]) {
  describe(`${factory.name} with unknown properties`, () => {
    it('accepts an omitted optional unknown property', () => {
      const Struct = factory({
        foo: optional(string()),
        baz: optional(unknown()),
      })
      expect(is({}, Struct)).toBe(true)
      expect(create({}, Struct)).toStrictEqual({})
    })

    it('accepts an omitted unknown property without optional()', () => {
      const Struct = factory({ baz: unknown() })
      expect(is({}, Struct)).toBe(true)
      expect(create({}, Struct)).toStrictEqual({})
    })

    it('accepts a present unknown property', () => {
      const Struct = factory({ baz: optional(unknown()) })
      expect(is({ baz: { nested: true } }, Struct)).toBe(true)
      expect(is({ baz: null }, Struct)).toBe(true)
    })

    it('still requires properties whose structs reject undefined', () => {
      const Struct = factory({ required: string(), baz: optional(unknown()) })
      expect(is({}, Struct)).toBe(false)
      expect(is({ required: 'value' }, Struct)).toBe(true)
    })
  })
}
