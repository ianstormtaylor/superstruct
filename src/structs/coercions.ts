import { Struct, is, Coercer } from '../struct.js'
import { isPlainObject } from '../utils.js'
import { string, unknown } from './types.js'

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

export function coerce<T, S, C>(
  struct: Struct<T, S>,
  condition: Struct<C, any>,
  coercer: Coercer<C>
): Struct<T, S> {
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

export function defaulted<T, S>(
  struct: Struct<T, S>,
  fallback: any,
  options: {
    strict?: boolean
  } = {}
): Struct<T, S> {
  return coerce(struct, unknown(), (x) => {
    // To avoid a pass-by-reference bug, we'll clone objects when encountered
    // here, but the for performance avoid cloning primatives and functions
    const f =
      typeof fallback === 'function'
        ? fallback()
        : typeof fallback === 'object'
          ? structuredClone(fallback)
          : fallback

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

export function trimmed<T, S>(struct: Struct<T, S>): Struct<T, S> {
  return coerce(struct, string(), (x) => x.trim())
}
