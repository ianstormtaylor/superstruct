import { Struct, mask } from '../struct'
import { ObjectSchema, ObjectType } from '../utils'

/**
 * Augment a `Struct` to add an additional coercion step to its input.
 *
 * This allows you to transform input data before validating it, to increase the
 * likelihood that it passes validation—for example for default values, parsing
 * different formats, etc.
 *
 * Note: You must use `coerce(value, Struct)` on the value to have the coercion
 * take effect! Using simply `assert()` or `is()` will not use coercion.
 */

export function coercion<T, S>(
  struct: Struct<T, S>,
  coercer: Struct<T, S>['coercer']
): Struct<T, S> {
  const fn = struct.coercer
  return new Struct({
    ...struct,
    coercer: (value) => {
      return fn(coercer(value))
    },
  })
}

/**
 * Augment a struct to replace `undefined` values with a default.
 *
 * Note: You must use `coerce(value, Struct)` on the value to have the coercion
 * take effect! Using simply `assert()` or `is()` will not use coercion.
 */

export function defaulted<T, S>(
  S: Struct<T, S>,
  fallback: any,
  strict?: true
): Struct<T, S> {
  return coercion(S, (x) => {
    const f = typeof fallback === 'function' ? fallback() : fallback

    if (x === undefined) {
      return f
    }

    if (strict !== true && isPlainObject(x) && isPlainObject(f)) {
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
 * Note: You must use `coerce(value, Struct)` on the value to have the coercion
 * take effect! Using simply `assert()` or `is()` will not use coercion.
 */

export function masked<S extends ObjectSchema>(
  struct: Struct<ObjectType<S>, S>
): Struct<ObjectType<S>, S> {
  return coercion(struct, (x) => {
    return typeof x !== 'object' || x == null ? x : mask(x, struct)
  })
}

/**
 * Check if a value is a plain object.
 */

function isPlainObject(value: unknown): value is { [key: string]: any } {
  if (Object.prototype.toString.call(value) !== '[object Object]') {
    return false
  }

  const prototype = Object.getPrototypeOf(value)
  return prototype === null || prototype === Object.prototype
}
