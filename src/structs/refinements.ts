import { Struct, Refiner } from '../struct'
import { toFailures } from '../utils'

/**
 * Ensure that a number is above a threshold.
 */

export function above<T extends number>(
  struct: Struct<T>,
  n: number
): Struct<T> {
  return refinement('above', struct, (value) => {
    return (
      value > n ||
      `Expected a ${struct.type} above ${n} but received \`${value}\``
    )
  })
}

/**
 * Ensure that a number is below a threshold.
 */

export function below<T extends number>(
  struct: Struct<T>,
  n: number
): Struct<T> {
  return refinement('below', struct, (value) => {
    return (
      value < n ||
      `Expected a ${struct.type} below ${n} but received \`${value}\``
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
      `Expected a ${struct.type} matching \`/${regexp.source}/\` but received "${value}"`
    )
  })
}

/**
 * Ensure that a string, array, number, map, or set has a size (or length) between `min` and `max`.
 */

export function size<
  T extends string | number | any[] | Map<any, any> | Set<any>
>(struct: Struct<T>, min: number, max: number = min): Struct<T> {
  const expected = `Expected a ${struct.type}`
  const of = min === max ? `of \`${min}\`` : `between \`${min}\` and \`${max}\``

  return refinement('size', struct, (value) => {
    if (typeof value === 'number') {
      return (
        (min <= value && value <= max) ||
        `${expected} ${of} but received \`${value}\``
      )
    } else if (value instanceof Map || value instanceof Set) {
      const { size } = value
      return (
        (min <= size && size <= max) ||
        `${expected} with a size ${of} but received one with a size of \`${size}\``
      )
    } else {
      const { length } = value as string | any[]
      return (
        (min <= length && length <= max) ||
        `${expected} with a length ${of} but received one with a length of \`${length}\``
      )
    }
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
