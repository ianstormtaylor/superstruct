import { Struct, Refiner } from '../struct'
import { toFailures } from '../utils'

/**
 * Ensure that a string, array, map, or set is empty.
 */

export function empty<
  T extends string | any[] | Map<any, any> | Set<any>,
  S extends any
>(struct: Struct<T, S>): Struct<T, S> {
  return refine(struct, 'empty', (value) => {
    const size = getSize(value)
    return (
      size === 0 ||
      `Expected an empty ${struct.type} but received one with a size of \`${size}\``
    )
  })
}

function getSize(value: string | any[] | Map<any, any> | Set<any>): number {
  if (value instanceof Map || value instanceof Set) {
    return value.size
  } else {
    return value.length
  }
}

/**
 * Ensure that a number or date is below a threshold.
 */

export function max<T extends number | Date, S extends any>(
  struct: Struct<T, S>,
  threshold: T,
  options: {
    exclusive?: boolean
  } = {}
): Struct<T, S> {
  const { exclusive } = options
  return refine(struct, 'max', (value) => {
    return exclusive
      ? value < threshold
      : value <= threshold ||
          `Expected a ${struct.type} less than ${
            exclusive ? '' : 'or equal to '
          }${threshold} but received \`${value}\``
  })
}

/**
 * Ensure that a number or date is above a threshold.
 */

export function min<T extends number | Date, S extends any>(
  struct: Struct<T, S>,
  threshold: T,
  options: {
    exclusive?: boolean
  } = {}
): Struct<T, S> {
  const { exclusive } = options
  return refine(struct, 'min', (value) => {
    return exclusive
      ? value > threshold
      : value >= threshold ||
          `Expected a ${struct.type} greater than ${
            exclusive ? '' : 'or equal to '
          }${threshold} but received \`${value}\``
  })
}

/**
 * Ensure that a string, array, map or set is not empty.
 */

export function nonempty<
  T extends string | any[] | Map<any, any> | Set<any>,
  S extends any
>(struct: Struct<T, S>): Struct<T, S> {
  return refine(struct, 'nonempty', (value) => {
    const size = getSize(value)
    return (
      size > 0 || `Expected a nonempty ${struct.type} but received an empty one`
    )
  })
}

/**
 * Ensure that a string matches a regular expression.
 */

export function pattern<T extends string, S extends any>(
  struct: Struct<T, S>,
  regexp: RegExp
): Struct<T, S> {
  return refine(struct, 'pattern', (value) => {
    return (
      regexp.test(value) ||
      `Expected a ${struct.type} matching \`/${regexp.source}/\` but received "${value}"`
    )
  })
}

/**
 * Ensure that a string, array, number, date, map, or set has a size (or length, or time) between `min` and `max`.
 */

export function size<
  T extends string | number | Date | any[] | Map<any, any> | Set<any>,
  S extends any
>(struct: Struct<T, S>, min: number, max: number = min): Struct<T, S> {
  const expected = `Expected a ${struct.type}`
  const of = min === max ? `of \`${min}\`` : `between \`${min}\` and \`${max}\``

  return refine(struct, 'size', (value) => {
    if (typeof value === 'number' || value instanceof Date) {
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

export function refine<T, S>(
  struct: Struct<T, S>,
  name: string,
  refiner: Refiner<T>
): Struct<T, S> {
  return new Struct({
    ...struct,
    *refiner(value, ctx) {
      yield* struct.refiner(value, ctx)
      const result = refiner(value, ctx)
      const failures = toFailures(result, ctx, struct, value)

      for (const failure of failures) {
        yield { ...failure, refinement: name }
      }
    },
  })
}
