import { toFailures, shiftIterator, print, StructSchema } from './utils'
import { StructError, Failure } from './error'
import { masked } from './structs/coercions'

/**
 * `Struct` objects encapsulate the validation logic for a specific type of
 * values. Once constructed, you use the `assert`, `is` or `validate` helpers to
 * validate unknown input data against the struct.
 */

export class Struct<T = unknown, S = unknown> {
  readonly TYPE!: T
  type: string
  schema: S
  coercer: Coercer
  validator: Validator<T, S>
  refiner: Refiner<T, S>

  constructor(props: {
    type: Struct<T, S>['type']
    schema: Struct<T, S>['schema']
    coercer?: Struct<T, S>['coercer']
    validator?: Struct<T, S>['validator']
    refiner?: Struct<T, S>['refiner']
  }) {
    const {
      type,
      schema,
      coercer = (value: unknown) => value,
      validator = () => [],
      refiner = () => [],
    } = props
    this.type = type
    this.schema = schema
    this.coercer = coercer
    this.validator = validator
    this.refiner = refiner
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
  ): [StructError, undefined] | [undefined, T] {
    return validate(value, this, options)
  }
}

/**
 * A `StructContext` contains information about the current value being
 * validated as well as helper functions for failures and recursive validating.
 */

export type Context<T, S> = {
  value: any
  struct: Struct<T, S>
  branch: Array<any>
  path: Array<string | number>
  fail: (props?: string | Partial<Failure>) => Failure
  check: <Y, Z>(
    value: any,
    struct: Struct<Y, Z>,
    parent?: any,
    key?: string | number
  ) => IterableIterator<Failure>
}

/**
 * A type utility to extract the type from a `Struct` class.
 */

export type Infer<T extends Struct<any, any>> = T['TYPE']

/**
 * A type utility to describe that a struct represents a TypeScript type.
 */

export type Describe<T> = Struct<T, StructSchema<T>>

/**
 * A `Result` is returned from validation functions.
 */

export type Result = boolean | string | Iterable<Failure>

/**
 * A `Coercer` takes an unknown value and optionally coerces it.
 */

export type Coercer = (value: unknown) => unknown

/**
 * A `Validate` takes an unknown value and validates it.
 */

export type Validator<T, S> = (value: unknown, context: Context<T, S>) => Result

/**
 * A `Refiner` takes a value of a known type and validates it against a further
 * constraint.
 */

export type Refiner<T, S> = (value: T, context: Context<T, S>) => Result

/**
 * Assert that a value passes a `Struct`, throwing if it doesn't.
 */

export function assert<T, S>(
  value: unknown,
  struct: Struct<T, S>
): asserts value is T {
  const result = validate(value, struct)

  if (result[0]) {
    throw result[0]
  }
}

/**
 * Create a value with the coercion logic of `Struct` and validate it.
 */

export function create<T, S>(value: unknown, struct: Struct<T, S>): T {
  const ret = struct.coercer(value)
  assert(ret, struct)
  return ret
}

/**
 * Mask a value, returning only the subset of properties defined by a Struct.
 */

export function mask<T, S>(value: unknown, struct: Struct<T, S>): T {
  const M = masked(struct)
  const ret = create(value, M)
  return ret
}

/**
 * Check if a value passes a `Struct`.
 */

export function is<T, S>(value: unknown, struct: Struct<T, S>): value is T {
  const result = validate(value, struct)
  return !result[0]
}

/**
 * Validate a value against a `Struct`, returning an error if invalid.
 */

export function validate<T, S>(
  value: unknown,
  struct: Struct<T, S>,
  options: {
    coerce?: boolean
  } = {}
): [StructError, undefined] | [undefined, T] {
  if (options.coerce) {
    value = struct.coercer(value)
  }

  const failures = check(value, struct)
  const failure = shiftIterator(failures)

  if (failure) {
    const error = new StructError(failure, failures)
    return [error, undefined]
  } else {
    return [undefined, value as T]
  }
}

/**
 * Check a value against a `Struct`, returning an iterable of failures.
 */

function* check<T, S>(
  value: unknown,
  struct: Struct<T, S>,
  path: any[] = [],
  branch: any[] = []
): IterableIterator<Failure> {
  const ctx: Context<T, S> = {
    value,
    struct,
    branch,
    path,
    check(v, s, parent, key) {
      const p = parent !== undefined ? [...path, key] : path
      const b = parent !== undefined ? [...branch, parent] : branch
      return check(v, s, p, b)
    },
    fail(props = {}) {
      if (typeof props === 'string') {
        props = { message: props }
      }

      const { type } = struct
      let { message, refinement } = props

      if (!message) {
        message = `Expected a value of type \`${type}\`${
          refinement ? ` with refinement \`${refinement}\`` : ''
        }${
          path.length ? ` for \`${path.join('.')}\`` : ''
        }, but received: \`${print(value)}\``
      }

      return {
        ...props,
        value,
        type,
        refinement,
        message,
        key: path[path.length - 1],
        path,
        branch: [...branch, value],
      }
    },
  }

  const failures = toFailures(struct.validator(value, ctx), ctx)
  const failure = shiftIterator(failures)

  if (failure) {
    yield failure
    yield* failures
  } else {
    yield* toFailures(struct.refiner(value as T, ctx), ctx)
  }
}
