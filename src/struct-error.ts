import invariant from 'tiny-invariant'

/**
 * `Path` arrays specify a nested value's location in a root object or array.
 */

export type Path = Array<number | string>

/**
 * `Branch` arrays contain each value following a path down from the root.
 */

export type Branch = Array<any>

/**
 * `Failure` objects represent a specific failure in validation. They are plain
 * objects that can be turned into true `StructError` when needed.
 */

export interface Failure {
  branch: Branch
  path: Path
  value: any
  type: string | null
}

/**
 * `StructError` objects are thrown or returned by Superstruct when an invalid
 * validation encounters an invalid value. They represent the first error
 * encountered, but also have a `failures` array property that holds information
 * for all of the failures encountered.
 */

export class StructError extends TypeError {
  constructor(failures: Failure[]) {
    invariant(
      failures.length > 0,
      `StructError requires being passed a failure, but received: ${failures}`
    )

    const [first] = failures
    const { path, value, type } = first
    const message = `Expected a value of type \`${type}\`${
      path.length ? ` for \`${path.join('.')}\`` : ''
    } but received \`${JSON.stringify(value)}\`.`

    super(message)
    Object.assign(this, first)
    this.failures = failures
    this.stack = new Error().stack
    ;(this as any).__proto__ = StructError.prototype
  }
}

export interface StructError {
  new (failures: Failure[]): StructError
  branch: Branch
  failures: Failure[]
  path: Path
  type: string | null
  value: any
}

export interface StructErrorConstructor {
  new (failures: Failure[]): StructError
}
