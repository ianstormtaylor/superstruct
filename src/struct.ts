import { Context, Failure, Result } from './typings'
import { toFailures, ObjectSchema, ObjectType } from './utils'

/**
 * `Struct` objects encapsulate the validation logic for a specific type of
 * values. Once constructed, you use the `assert`, `is` or `validate` helpers to
 * validate unknown input data against the struct.
 */

export class Struct<T = unknown, S = unknown> {
  readonly TYPE!: T
  type: string
  schema: S
  coercer: (value: unknown) => unknown
  validator: (value: unknown, context: Context) => Result
  refiner: (value: T, context: Context) => Result

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
   * Coerce a value with the struct's coercion logic, then validate it.
   */

  coerce(value: unknown): T {
    return coerce(value, this)
  }

  /**
   * Check if a value passes the struct's validation.
   */

  is(value: unknown): value is T {
    return is(value, this)
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
    withCoercion?: true
  ): [StructError, undefined] | [undefined, T] {
    return validate(value, this, withCoercion)
  }
}

/**
 * `StructError` objects are thrown (or returned) when validation fails.
 *
 * Validation logic is design to exit early for maximum performance. The error
 * represents the first error encountered during validation. For more detail,
 * the `error.failures` property is a generator function that can be run to
 * continue validation and receive all the failures in the data.
 */

export class StructError extends TypeError {
  value: any
  type: string
  path: Array<number | string>
  branch: Array<any>
  failures: () => IterableIterator<Failure>;
  [key: string]: any

  constructor(failure: Failure, iterable: Iterable<Failure>) {
    const { path, value, type, branch, ...rest } = failure
    const message = `Expected a value of type \`${type}\`${
      path.length ? ` for \`${path.join('.')}\`` : ''
    } but received \`${JSON.stringify(value)}\`.`

    function* failures() {
      yield failure
      yield* iterable
    }

    super(message)
    this.value = value
    Object.assign(this, rest)
    this.type = type
    this.path = path
    this.branch = branch
    this.failures = failures
    this.stack = new Error().stack
    ;(this as any).__proto__ = StructError.prototype
  }
}

/**
 * Assert that a value passes a `Struct`, throwing if it doesn't.
 */

export function assert<T>(
  value: unknown,
  struct: Struct<T>
): asserts value is T {
  const result = validate(value, struct)

  if (result[0]) {
    throw result[0]
  }
}

/**
 * Coerce a value with the coercion logic of `Struct` and validate it.
 */

export function coerce<T>(value: unknown, struct: Struct<T>): T {
  const ret = struct.coercer(value)
  assert(ret, struct)
  return ret
}

/**
 * Mask a value, returning only the subset of properties defined by a Struct.
 */

export function mask<S extends ObjectSchema>(
  value: unknown,
  struct: Struct<ObjectType<S>, S>,
  withCoercion: boolean = false
): ObjectType<S> {
  const ret: any = {}

  if (withCoercion) {
    value = struct.coercer(value)
  }

  if (typeof value === 'object' && value != null) {
    for (const key in struct.schema) {
      if (key in value) {
        ret[key] = (value as any)[key]
      }
    }
  }

  assert(ret, struct)
  return ret
}

/**
 * Check if a value passes a `Struct`.
 */

export function is<T>(value: unknown, struct: Struct<T>): value is T {
  const result = validate(value, struct)
  return !result[0]
}

/**
 * Validate a value against a `Struct`, returning an error if invalid.
 */

export function validate<T>(
  value: unknown,
  struct: Struct<T>,
  withCoercion: boolean = false
): [StructError, undefined] | [undefined, T] {
  if (withCoercion) {
    value = struct.coercer(value)
  }

  const iterable = check(value, struct)
  const [failure] = iterable

  if (failure) {
    const error = new StructError(failure, iterable)
    return [error, undefined]
  } else {
    return [undefined, value as T]
  }
}

/**
 * Check a value against a `Struct`, returning an iterable of failures.
 */

function* check<T>(
  value: unknown,
  struct: Struct<T>,
  path: any[] = [],
  branch: any[] = []
): Iterable<Failure> {
  const { type } = struct
  const ctx: Context = {
    value,
    type,
    branch,
    path,
    fail(props = {}) {
      return { value, type, path, branch: [...branch, value], ...props }
    },
    check(v, s, parent, key) {
      const p = parent !== undefined ? [...path, key] : path
      const b = parent !== undefined ? [...branch, parent] : branch
      return check(v, s, p, b)
    },
  }

  const failures = toFailures(struct.validator(value, ctx), ctx)
  const [failure] = failures

  if (failure) {
    yield failure
    yield* failures
  } else {
    yield* toFailures(struct.refiner(value as T, ctx), ctx)
  }
}
