/**
 * A `StructFailure` represents a single specific failure in validation.
 */

export type Failure = {
  value: any
  key: string | number | undefined
  type: string
  refinement: string | undefined
  message: string | undefined
  branch: Array<any>
  path: Array<string | number>
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
  key: string | number | undefined
  type: string
  refinement: string | undefined
  path: Array<number | string>
  branch: Array<any>
  failures: () => IterableIterator<Failure>;
  [key: string]: any

  constructor(failure: Failure, iterable: Iterable<Failure>) {
    const { path, value, key, type, refinement, branch, ...rest } = failure
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
    this.key = key
    this.type = type
    this.refinement = refinement
    this.path = path
    this.branch = branch
    this.failures = failures
    this.stack = new Error().stack
    ;(this as any).__proto__ = StructError.prototype
  }
}
