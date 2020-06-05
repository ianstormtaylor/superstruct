/**
 * `Struct` objects encapsulate the schema for a specific data type (with
 * optional coercion). You can then use the `assert`, `is` or `validate` helpers
 * to validate unknown data against a struct.
 */

export class Struct<T> {
  type: string
  coercer: (value: unknown) => unknown
  validator: (value: unknown, context: StructContext) => StructResult
  refiner: (value: T, context: StructContext) => StructResult

  constructor(
    props: {
      type?: Struct<T>['type']
      coercer?: Struct<T>['coercer']
      validator?: Struct<T>['validator']
      refiner?: Struct<T>['refiner']
    } = {}
  ) {
    const {
      type = 'unknown',
      coercer = (value: unknown) => value,
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
 * `StructError` objects are thrown (or returned) by Superstruct when its
 * validation fails. The error represents the first error encountered during
 * validation. But they also have an `error.failures` property that holds
 * information for all of the failures encountered.
 */

export class StructError extends TypeError {
  value: any
  type: string
  path: Array<number | string>
  branch: Array<any>
  failures: () => Iterable<StructFailure>;
  [key: string]: any

  constructor(failure: StructFailure, iterable: Iterable<StructFailure>) {
    const { path, value, type, branch, ...rest } = failure
    const message = `Expected a value of type \`${type}\`${
      path.length ? ` for \`${path.join('.')}\`` : ''
    } but received \`${JSON.stringify(value)}\`.`

    function* failures(): Iterable<StructFailure> {
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
 * A `StructContext` contains information about the current value being
 * validated as well as helper functions for failures and recursive validating.
 */

export type StructContext = {
  value: any
  type: string
  branch: Array<any>
  path: Array<string | number>
  fail: (props?: Partial<StructFailure>) => StructFailure
  check: (
    value: any,
    struct: Struct<any> | Struct<never>,
    parent?: any,
    key?: string | number
  ) => Iterable<StructFailure>
}

/**
 * A `StructFailure` represents a single specific failure in validation.
 */

export type StructFailure = {
  value: StructContext['value']
  type: StructContext['type']
  branch: StructContext['branch']
  path: StructContext['path']
  [key: string]: any
}

/**
 * A `StructResult` is returned from validation functions.
 */

export type StructResult = boolean | Iterable<StructFailure>

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
 * Check if a value passes a `Struct`.
 */

export function is<T>(value: unknown, struct: Struct<T>): value is T {
  const result = validate(value, struct)
  return !!result[0]
}

/**
 * Validate a value against a `Struct`, returning an error if invalid.
 */

export function validate<T>(
  value: unknown,
  struct: Struct<T>
): [StructError, undefined] | [undefined, T] {
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

export function* check<T>(
  value: unknown,
  struct: Struct<T>,
  path: any[] = [],
  branch: any[] = [value]
): Iterable<StructFailure> {
  const { type } = struct
  const ctx: StructContext = {
    value,
    type,
    branch,
    path,
    fail(props = {}) {
      return { value, type, path, branch, ...props }
    },
    check(v, s, parent, key) {
      const p = parent !== undefined ? path.concat(key) : path
      const b = parent !== undefined ? branch.concat(parent) : branch
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

/**
 * Coerce a value with a `Struct`.
 */

export function coerce<T>(value: unknown, struct: Struct<T>) {
  return struct.coercer(value)
}

/**
 * Convert a validation result to an iterable of failures.
 */

export function toFailures(
  result: StructResult,
  context: StructContext
): Iterable<StructFailure> {
  if (result === true) {
    return []
  } else if (result === false) {
    return [context.fail()]
  } else {
    return result
  }
}
