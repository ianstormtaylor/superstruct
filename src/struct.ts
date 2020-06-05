import { StructFailure } from './failure'
import { StructError } from './error'

export type Fail = (props?: Partial<StructFailure>) => StructFailure
export type Result = boolean | Iterable<StructFailure>

/**
 * `Struct` objects encapsulate the schema for a specific data type (with
 * optional coercion). You can then use the `assert`, `is` or `validate` helpers
 * to validate unknown data against a struct.
 */

export class Struct<T> {
  type: string
  coercer: (x: unknown) => unknown
  validator: (x: unknown, fail: Fail) => Result
  refiner: (x: T, fail: Fail) => Result

  constructor(
    props: {
      type?: Struct<T>['type']
      coercer?: Struct<T>['coercer']
      validator?: Struct<T>['validator']
      refiner?: Struct<T>['refiner']
    } = {}
  ) {
    const {
      type = 'any',
      coercer = (x: unknown) => x,
      validator = () => [],
      refiner = () => [],
    } = props
    this.type = type
    this.coercer = coercer
    this.validator = validator
    this.refiner = refiner
  }
}

/**
 * A type utility to extract the type from a `Struct` class.
 */

export type StructType<T extends Struct<any>> = Parameters<T['refiner']>[0]

/**
 * Define a `Struct` instance with a type and validation function.
 */

export function struct<T>(
  type: string,
  validator: Struct<T>['validator'],
  coercer: Struct<T>['coercer'] = x => x,
  refiner: Struct<T>['refiner'] = () => []
): Struct<T> {
  return new Struct({ type, validator, coercer, refiner })
}

/**
 * Assert that a value passes a `Struct`, throwing if it doesn't.
 */

export function assert<T>(x: unknown, struct: Struct<T>): asserts x is T {
  const result = validate(x, struct)

  if (result[0]) {
    throw result[0]
  }
}

/**
 * Check if a value passes a `Struct`.
 */

export function is<T>(x: unknown, struct: Struct<T>): x is T {
  const result = validate(x, struct)
  return !!result[0]
}

/**
 * Validate a value against a `Struct`, returning an error if invalid.
 */

export function validate<T>(
  x: unknown,
  struct: Struct<T>
): [StructError, undefined] | [undefined, T] {
  const iterable = check(x, struct)
  const [failure] = iterable

  if (failure) {
    const error = new StructError(failure, iterable)
    return [error, undefined]
  } else {
    return [undefined, x as T]
  }
}

/**
 * Check a value against a `Struct`, returning an iterable of failures.
 */

export function* check<T>(
  x: unknown,
  struct: Struct<T>
): Iterable<StructFailure> {
  const fail: Fail = (props = {}) => {
    return new StructFailure({
      value: x,
      type: struct.type,
      path: [],
      branch: [x],
      ...props,
    })
  }

  const failures = toFailures(struct.validator(x, fail), fail)
  const [failure] = failures

  if (failure) {
    yield failure
    yield* failures
  } else {
    yield* toFailures(struct.refiner(x as T, fail), fail)
  }
}

/**
 * Coerce a value with a `Struct`.
 */

export function coerce<T>(x: unknown, struct: Struct<T>) {
  return struct.coercer(x)
}

/**
 * Convert a validation result to an iterable of failures.
 */

export function toFailures(
  result: boolean | Iterable<StructFailure>,
  fail: Fail
): Iterable<StructFailure> {
  if (result === true) {
    return []
  } else if (result === false) {
    return [fail()]
  } else {
    return result
  }
}
