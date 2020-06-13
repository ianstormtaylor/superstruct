import { Struct, Refiner } from '../struct'
import { toFailures } from '../utils'

/**
 * Ensure that a string or array has a length of zero.
 */

export function empty<T extends string | any[]>(struct: Struct<T>): Struct<T> {
  return refinement('empty', struct, (value) => {
    return (
      value.length === 0 || `Expected an empty value but received \`${value}\``
    )
  })
}

/**
 * Ensure that a string or array has a length between `min` and `max`.
 */

export function length<T extends string | any[]>(
  struct: Struct<T>,
  min: number,
  max: number
): Struct<T> {
  return refinement('length', struct, (value) => {
    return (
      (min < value.length && value.length < max) ||
      `Expected a value with a length between \`${min}\` and \`${max}\` but received a length of \`${value.length}\``
    )
  })
}

/**
 * Ensure that a number is negative (not zero).
 */

export function negative<T extends number>(struct: Struct<T>): Struct<T> {
  return refinement('negative', struct, (value) => {
    return value < 0 || `Expected a negative number but received \`${value}\``
  })
}

/**
 * Ensure that a number is non-negative (includes zero).
 */

export function nonnegative<T extends number>(struct: Struct<T>): Struct<T> {
  return refinement('nonnegative', struct, (value) => {
    return (
      0 <= value || `Expected a non-negative number but received \`${value}\``
    )
  })
}

/**
 * Ensure that a number is non-positive (includes zero).
 */

export function nonpositive<T extends number>(struct: Struct<T>): Struct<T> {
  return refinement('nonpositive', struct, (value) => {
    return (
      0 >= value || `Expected a non-positive number but received \`${value}\``
    )
  })
}

/**
 * Ensure that a string matches a regular expression.
 */

export function pattern<T extends string>(
  struct: Struct<T>,
  regexp: RegExp
): Struct<T> {
  return refinement('pattern', struct, (value) => {
    return (
      regexp.test(value) ||
      `Expected a string matching \`/${regexp.source}/\` but received "${value}"`
    )
  })
}

/**
 * Ensure that a number is positive (not zero).
 */

export function positive<T extends number>(struct: Struct<T>): Struct<T> {
  return refinement('positive', struct, (value) => {
    return 0 < value || `Expected a positive number but received \`${value}\``
  })
}

/**
 * Augment a `Struct` to add an additional refinement to the validation.
 *
 * The refiner function is guaranteed to receive a value of the struct's type,
 * because the struct's existing validation will already have passed. This
 * allows you to layer additional validation on top of existing structs.
 */

export function refinement<T, S>(
  name: string,
  struct: Struct<T, S>,
  refiner: Refiner<T, S>
): Struct<T, S> {
  const fn = struct.refiner
  return new Struct({
    ...struct,
    *refiner(value, ctx) {
      yield* toFailures(fn(value, ctx), ctx)

      for (const failure of toFailures(refiner(value, ctx), ctx)) {
        yield { ...failure, refinement: name }
      }
    },
  })
}
