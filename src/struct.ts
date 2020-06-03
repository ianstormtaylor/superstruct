import { StructFailure } from './failure'
import { StructError } from './error'

type Fail = (props?: Partial<StructFailure>) => StructFailure

/**
 * `Struct` objects encapsulate the schema for a specific data type (with
 * optional coercion). You can then use the `assert`, `is` or `validate` helpers
 * to validate unknown data against a struct.
 */

export class Struct<T> {
  type: string
  identity: (x: T) => T
  coerce: (x: unknown) => unknown
  validate: (x: unknown, fail: Fail) => Iterable<StructFailure>
  constrain: (x: T, fail: Fail) => Iterable<StructFailure>

  constructor(
    props: {
      type?: Struct<T>['type']
      coerce?: Struct<T>['coerce']
      validate?: Struct<T>['validate']
      constrain?: Struct<T>['constrain']
    } = {}
  ) {
    const {
      type = 'any',
      coerce = (x: unknown) => x,
      validate = () => [],
      constrain = () => [],
    } = props
    this.type = type
    this.coerce = coerce
    this.validate = validate
    this.constrain = constrain
    this.identity = x => x
  }

  assert(value: unknown): asserts value is T {
    assert(value, this)
  }
}

/**
 * A type utility to extract the type from a `Struct` class.
 */

export type StructType<T extends Struct<any>> = Parameters<T['identity']>[0]

/**
 * Assert that a value passes a `Struct`, throwing if it doesn't.
 */

export function assert<T>(x: unknown, struct: Struct<T>): asserts x is T
export function assert<T>(x: unknown, struct: Struct<T>, coerce: true): T
export function assert<T>(x: unknown, struct: Struct<T>, coerce?: true): any {
  const result = validate(x, struct, coerce)

  if (result[0]) {
    throw result[0]
  } else if (coerce) {
    return result[1]
  }
}

/**
 * Check if a value passes a `Struct`.
 *
 * Note: the third argument is a coercion flag. If `true` is passed, then
 * the struct's coercion is enabled. However note that in this case the boolean
 * result only represents the validity of the *coerced* value!
 */

export function is<T>(x: unknown, struct: Struct<T>): x is T
export function is<T>(x: unknown, struct: Struct<T>, coerce: true): boolean
export function is<T>(x: unknown, struct: Struct<T>, coerce?: true): any {
  const result = validate(x, struct, coerce)
  return !!result[0]
}

/**
 * Validate a value against a `Struct`, returning an error if invalid.
 */

export function validate<T>(
  x: unknown,
  struct: Struct<T>,
  coerce?: true
): [StructError, undefined] | [undefined, T] {
  if (coerce) {
    x = struct.coerce(x)
  }

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

  const iterable = struct.validate(x, fail)
  const [failure] = iterable

  if (failure) {
    yield failure
    yield* iterable
  } else {
    yield* struct.constrain(x as T, fail)
  }
}

/**
 * Augment a `Struct` to add an additional coercion step to its input.
 */

export function coerce<T>(
  struct: Struct<T>,
  coerce: (x: unknown) => unknown
): Struct<T> {
  const fn = struct.coerce
  return new Struct({
    ...struct,
    coerce: value => {
      return fn(coerce(value))
    },
  })
}

/**
 * Augment a `Struct` to add an additional constraint to the validation.
 */

export function constrain<T>(
  struct: Struct<T>,
  constrain: (x: T, fail: Fail) => Iterable<StructFailure>
): Struct<T> {
  const fn = struct.constrain
  return new Struct({
    ...struct,
    type: `Constrained<${struct.type}>`,
    *constrain(value, fail) {
      yield* fn(value, fail)
      yield* constrain(value, fail)
    },
  })
}
