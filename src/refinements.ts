import { Struct } from './struct'
import { toFailures } from './xtras'

/**
 * Ensure that a string or array has a length of zero.
 */

export function empty<T extends string | any[]>(S: Struct<T>): Struct<T> {
  return refinement(S, `${S.type} & Empty`, (value) => {
    return value.length === 0
  })
}

/**
 * Ensure that a string or array has a length between `min` and `max`.
 */

export function length<T extends string | any[]>(
  S: Struct<T>,
  min: number,
  max: number
): Struct<T> {
  return refinement(S, `${S.type} & Length<${min},${max}>`, (value) => {
    return min < value.length && value.length < max
  })
}

/**
 * Ensure that a number is negative (not zero).
 */

export function negative<T extends number>(S: Struct<T>): Struct<T> {
  return refinement(S, S.type, (value) => {
    return 0 > value
  })
}

/**
 * Ensure that a number is non-negative (includes zero).
 */

export function nonnegative<T extends number>(S: Struct<T>): Struct<T> {
  return refinement(S, S.type, (value) => {
    return 0 <= value
  })
}

/**
 * Ensure that a number is non-positive (includes zero).
 */

export function nonpositive<T extends number>(S: Struct<T>): Struct<T> {
  return refinement(S, S.type, (value) => {
    return 0 >= value
  })
}

/**
 * Ensure that a string matches a regular expression.
 */

export function pattern<T extends string>(
  S: Struct<T>,
  regexp: RegExp
): Struct<T> {
  return refinement(S, `${S.type} & Pattern<${regexp.source}>`, (value) => {
    return regexp.test(value)
  })
}

/**
 * Ensure that a number is positive (not zero).
 */

export function positive<T extends number>(S: Struct<T>): Struct<T> {
  return refinement(S, S.type, (value) => {
    return 0 < value
  })
}

/**
 * Augment a `Struct` to add an additional refinement to the validation.
 *
 * The refiner function is guaranteed to receive a value of the struct's type,
 * because the struct's existing validation will already have passed. This
 * allows you to layer additional validation on top of existing structs.
 */

export function refinement<T>(
  struct: Struct<T>,
  type: string,
  refiner: Struct<T>['refiner']
): Struct<T> {
  const fn = struct.refiner
  return new Struct({
    ...struct,
    type,
    *refiner(value, fail) {
      yield* toFailures(fn(value, fail), fail)
      yield* toFailures(refiner(value, fail), fail)
    },
  })
}
