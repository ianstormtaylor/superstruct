import { toFailures, iteratorShift } from './utils'

/**
 * `Struct` objects encapsulate the schema for a specific data type (with
 * optional coercion). You can then use the `assert`, `is` or `validate` helpers
 * to validate unknown data against a struct.
 */

export class Struct<T, S = any> {
  type: string
  schema: S
  coercer: (value: unknown) => unknown
  validator: (value: unknown, context: StructContext) => StructResult
  refiner: (value: T, context: StructContext) => StructResult

  constructor(props: {
    type: Struct<T>['type']
    schema: S
    coercer?: Struct<T>['coercer']
    validator?: Struct<T>['validator']
    refiner?: Struct<T>['refiner']
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
  failures: () => Array<StructFailure>;
  [key: string]: any

  constructor(
    failure: StructFailure,
    moreFailures: IterableIterator<StructFailure>
  ) {
    const { path, value, type, branch, ...rest } = failure
    const message = `Expected a value of type \`${type}\`${
      path.length ? ` for \`${path.join('.')}\`` : ''
    } but received \`${JSON.stringify(value)}\`.`

    let failuresResult: Array<StructFailure> | undefined
    function failures(): Array<StructFailure> {
      if (!failuresResult) {
        failuresResult = [failure, ...moreFailures]
      }
      return failuresResult
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
  ) => IterableIterator<StructFailure>
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
  coercing: boolean = false
): [StructError, undefined] | [undefined, T] {
  if (coercing) {
    value = struct.coercer(value)
  }

  const failures = check(value, struct)
  const failure = iteratorShift(failures)

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

function* check<T>(
  value: unknown,
  struct: Struct<T>,
  path: any[] = [],
  branch: any[] = []
): IterableIterator<StructFailure> {
  const { type } = struct
  const ctx: StructContext = {
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
  const failure = iteratorShift(failures)

  if (failure) {
    yield failure
    yield* failures
  } else {
    yield* toFailures(struct.refiner(value as T, ctx), ctx)
  }
}
