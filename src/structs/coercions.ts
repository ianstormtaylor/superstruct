import { Error, TypeErrorDetail } from '../error'
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

export function coerce<T, S, C, E1 extends Error, E2 extends Error>(
  struct: Struct<T, S, E1>,
  condition: Struct<C, any, E2>,
  coercer: Coercer<C>
): Struct<T, S, E1 | E2> {
  return new Struct<T,S,E1 | E2>({
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
 * Augment a struct to mask its input to only properties defined in the struct.
 *
 * Note: You must use `create(value, Struct)` on the value to have the coercion
 * take effect! Using simply `assert()` or `is()` will not use coercion.
 */

export function masked<T, S, E extends Error>(struct: Struct<T, S, E>): Struct<T, S, E> {
  return coerce(struct, unknown(), (x) => {
    if (
      typeof struct.schema !== 'object' ||
      struct.schema == null ||
      typeof x !== 'object' ||
      x == null
    ) {
      return x
    } else {
      const ret: any = {}

      for (const key in struct.schema) {
        if (key in x) {
          ret[key] = (x as any)[key]
        }
      }

      return ret
    }
  })
}

/**
 * Augment a struct to trim string inputs.
 *
 * Note: You must use `create(value, Struct)` on the value to have the coercion
 * take effect! Using simply `assert()` or `is()` will not use coercion.
 */

export function trimmed<T, S, E extends Error>(struct: Struct<T, S, E>): Struct<T, S, E|TypeErrorDetail> {
  return coerce(struct, string(), (x) => x.trim())
}
