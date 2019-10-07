import { Branch, Failure, Path } from './interfaces'

/**
 * `StructError` objects are thrown or returned by Superstruct when an invalid
 * validation encounters an invalid value. They represent the first error
 * encountered, but also have a `failures` array property that holds information
 * for all of the failures encountered.
 */

class StructError extends TypeError {
  constructor(failures: Failure[]) {
    const [first] = failures

    if (!first) {
      throw new Error(
        `StructError requires being passed a failure, but received: ${failures}`
      )
    }

    const { branch, path, value, reason, type } = first
    const message = `Expected a value of type \`${type}\`${
      path.length ? ` for \`${path.join('.')}\`` : ''
    } but received \`${JSON.stringify(value)}\`.`

    super(message)
    this.type = type
    this.value = value
    this.path = path
    this.branch = branch
    this.reason = reason
    this.failures = failures
    this.stack = new Error().stack
    ;(this as any).__proto__ = StructError.prototype
  }
}

interface StructError {
  branch: Branch
  failures: Failure[]
  path: Path
  reason: string | null
  type: string | null
  value: any
}

export { StructError }
