import { Struct, is, Coercer } from '../struct'
import { isPlainObject } from '../utils'
import { string, unknown } from './types'

/**
 * Augment a `Struct` to add an additional coercion step to its input.
 *
 * This allows you to transform input data before validating it, to increase the
 * likelihood that it passes validation—for example for default values, parsing
 * different formats, etc.
 *
 * Note: You must use `create(value, Struct)` on the value to have the coercion
 * take effect! Using simply `assert()` or `is()` will not use coercion.
 */

export function coerce<T, S, C, UC>(
  struct: Struct<T, S, UC>,
  condition: Struct<C, any, any>,
  coercer: Coercer<C>
): Struct<T, S, UC | C | T> {
  return new Struct({
    ...struct,
    coercer: (value, ctx) => {
      return is(value, condition)
        ? struct.coercer(coercer(value, ctx), ctx)
        : struct.coercer(value, ctx)
    },
  })
}

/**
 * Augment a struct to replace `undefined` values with a default.
 *
 * Note: You must use `create(value, Struct)` on the value to have the coercion
 * take effect! Using simply `assert()` or `is()` will not use coercion.
 */

export function defaulted<T, S, C>(
  struct: Struct<T, S, C>,
  fallback: any,
  options: {
    strict?: boolean
  } = {}
): Struct<T, S, undefined | Partial<T> | C> {
  return coerce(struct, unknown() as Struct<undefined | Partial<T>>, (x) => {
    const f = typeof fallback === 'function' ? fallback() : fallback

    if (x === undefined) {
      return f
    }

    if (!options.strict && isPlainObject(x) && isPlainObject(f)) {
      const ret = { ...x }
      let changed = false

      for (const key in f) {
        if (ret[key] === undefined) {
          ret[key] = f[key]
          changed = true
        }
      }

      if (changed) {
        return ret
      }
    }

    return x
  })
}

/**
 * Augment a struct to trim string inputs.
 *
 * Note: You must use `create(value, Struct)` on the value to have the coercion
 * take effect! Using simply `assert()` or `is()` will not use coercion.
 */

export function trimmed<T, S>(struct: Struct<T, S>): Struct<T, S, string | T> {
  return coerce(struct, string(), (x) => x.trim())
}
