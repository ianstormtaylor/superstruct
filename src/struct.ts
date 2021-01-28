import { toFailures, shiftIterator, StructSchema, run } from './utils'
import {
  StructError,
  Failure,
  Error,
  ErrorDetail,
  ThrowErrorDetail,
} from './error'
import { masked } from './structs/coercions'

/**
 * `Struct` objects encapsulate the validation logic for a specific type of
 * values. Once constructed, you use the `assert`, `is` or `validate` helpers to
 * validate unknown input data against the struct.
 */
export class Struct<T = unknown, S = unknown, E extends Error = never> {
  readonly TYPE!: T
  type: string
  schema: S
  coercer: (value: unknown, context: Context) => unknown
  validator: (value: unknown, context: Context) => Iterable<Failure<E>>
  refiner: (value: T, context: Context) => Iterable<Failure<E>>
  entries: (
    value: unknown,
    context: Context
  ) => Iterable<
    [
      string | number,
      unknown,
      Struct<any, unknown, E> | Struct<never, unknown, E>
    ]
  >

  constructor(props: {
    type: string
    schema: S
    coercer?: Coercer
    validator?: Validator<E>
    refiner?: Refiner<T, E>
    entries?: Struct<T, S, E>['entries']
  }) {
    const {
      type,
      schema,
      validator,
      refiner,
      coercer = (value: unknown) => value,
      entries = function* () {},
    } = props

    this.type = type
    this.schema = schema
    this.entries = entries
    this.coercer = coercer

    if (validator) {
      this.validator = (value, context) => {
        const result = validator(value, context)
        if (result === true || result === undefined) return []
        return toFailures(result, context, this, value)
      }
    } else {
      this.validator = () => []
    }

    if (refiner) {
      this.refiner = (value, context) => {
        const result = refiner(value, context)
        if (result === true || result === undefined) return []
        return toFailures(result, context, this, value)
      }
    } else {
      this.refiner = () => []
    }
  }

  /**
   * Assert that a value passes the struct's validation, throwing if it doesn't.
   */

  assert(value: unknown): asserts value is T {
    return assert(value, this)
  }

  /**
   * Create a value with the struct's coercion logic, then validate it.
   */

  create(value: unknown): T {
    return create(value, this)
  }

  /**
   * Check if a value passes the struct's validation.
   */

  is(value: unknown): value is T {
    return is(value, this)
  }

  /**
   * Mask a value, coercing and validating it, but returning only the subset of
   * properties defined by the struct's schema.
   */

  mask(value: unknown): T {
    return mask(value, this)
  }

  /**
   * Validate a value with the struct's validation logic, returning a tuple
   * representing the result.
   *
   * You may optionally pass `true` for the `withCoercion` argument to coerce
   * the value before attempting to validate it. If you do, the result will
   * contain the coerced result when successful.
   */

  validate(
    value: unknown,
    options: {
      coerce?: boolean
    } = {}
  ): [StructError<E | ThrowErrorDetail>, undefined] | [undefined, T] {
    return validate(value, this, options)
  }
}

/**
 * Assert that a value passes a struct, throwing if it doesn't.
 */

export function assert<T, S, E extends Error>(
  value: unknown,
  struct: Struct<T, S, E>
): asserts value is T {
  const result = validate(value, struct)

  if (result[0]) {
    throw result[0]
  }
}

/**
 * Create a value with the coercion logic of struct and validate it.
 */

export function create<T, S, E extends Error>(
  value: unknown,
  struct: Struct<T, S, E>
): T {
  const result = validate(value, struct, { coerce: true })

  if (result[0]) {
    throw result[0]
  } else {
    return result[1]
  }
}

/**
 * Mask a value, returning only the subset of properties defined by a struct.
 */

export function mask<T, S, E extends Error>(
  value: unknown,
  struct: Struct<T, S, E>
): T {
  const M = masked(struct)
  const ret = create(value, M)
  return ret
}

/**
 * Check if a value passes a struct.
 */

export function is<T, S, E extends Error>(
  value: unknown,
  struct: Struct<T, S, E>
): value is T {
  const result = validate(value, struct)
  return !result[0]
}

/**
 * Validate a value against a struct, returning an error if invalid, or the
 * value (with potential coercion) if valid.
 */

export function validate<T, S, E extends Error>(
  value: unknown,
  struct: Struct<T, S, E>,
  options: {
    coerce?: boolean
  } = {}
): [StructError<E | ThrowErrorDetail>, undefined] | [undefined, T] {
  const tuples = run(value, struct, options)
  const tuple = shiftIterator(tuples)!

  if (tuple[0]) {
    const error = new StructError(tuple[0], function* () {
      for (const t of tuples) {
        if (t[0]) {
          yield t[0]
        }
      }
    })

    return [error, undefined]
  } else {
    const v = tuple[1]
    return [undefined, v]
  }
}

/**
 * A `Context` contains information about the current location of the
 * validation inside the initial input value.
 */

export type Context = {
  branch: Array<any>
  path: Array<any>
}

/**
 * A type utility to extract the type from a `Struct` class.
 */

export type Infer<T extends Struct<any, any, any>> = T['TYPE']

/**
 * A type utility to describe that a struct represents a TypeScript type.
 */

export type Describe<T> = Struct<T, StructSchema<T>, any> // todo

export type InferError<T> = T extends Struct<any, any, infer E> ? E : Error

/**
 * A `Result` is returned from validation functions.
 */

export type Result<E extends ErrorDetail> =
  // | boolean
  // | string
  // | Partial<Failure<E>>
  // | Iterable<boolean | string | Partial<Failure<E>>>
  // undefined | Iterable<Failure<E>> | Failure<E>
  /* BasicResult |*/ | DescribedResult<E>
  | Iterable</* BasicResult | */ DescribedResult<E>>

// export type BasicResult = boolean | string;
export type DescribedResult<E extends ErrorDetail> = E | Failure<E>

/**
 * A `Coercer` takes an unknown value and optionally coerces it.
 */

export type Coercer<T = unknown> = (value: T, context: Context) => unknown

/**
 * A `Validator` takes an unknown value and validates it.
 */

export type Validator<E extends ErrorDetail> = (
  value: unknown,
  context: Context
) => Iterable<E | Failure<E>> | true

export type SimpleValidator = (
  value: unknown,
  context: Context
) => string | boolean | undefined

/**
 * A `Refiner` takes a value of a known type and validates it against a further
 * constraint.
 */

export type Refiner<T, E extends ErrorDetail> = (
  value: T,
  context: Context
) => Iterable<E | Failure<E>> | true

export type SimpleRefiner<T> = (
  value: T,
  context: Context
) => string | boolean | undefined
