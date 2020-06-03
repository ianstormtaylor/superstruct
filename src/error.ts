import { StructFailure } from './failure'

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
