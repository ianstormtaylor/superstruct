import invariant from 'tiny-invariant'

/**
 * `StructError` objects are thrown (or returned) by Superstruct when its
 * validation fails. The error represents the first error encountered during
 * validation. But they also have an `error.failures` property that holds
 * information for all of the failures encountered.
 */

export class StructError extends TypeError {
  branch: Branch
  failures: Failure[]
  path: Path
  type: string | undefined
  value: any
  [key: string]: any

  constructor(failures: Failure[]) {
    invariant(
      failures.length > 0,
      `StructError requires being passed a failure, but received: ${failures}`
    )

    const [first] = failures
    const { path, value, type, branch, ...rest } = first
    const message = `Expected a value of type \`${type}\`${
      path.length ? ` for \`${path.join('.')}\`` : ''
    } but received \`${JSON.stringify(value)}\`.`

    super(message)
    this.type = type
    this.value = value
    Object.assign(this, rest)
    this.path = path
    this.branch = branch
    this.failures = failures
    this.stack = new Error().stack
    ;(this as any).__proto__ = StructError.prototype
  }
}

/**
 * `Path` arrays specify a nested value's location in a root object or array.
 *
 * ```js
 * ['user', 'address', 'city']
 * ['nodes', 1, 'nodes', 0, 'text']
 * ```
 */

export type Path = Array<number | string>

/**
 * `Branch` arrays contain each value following a path down from the root.
 *
 * ```js
 * [root, ..., parent, value]
 * ```
 */

export type Branch = Array<any>

/**
 * `Failure` objects represent a specific failure in validation. They are plain
 * objects that can be turned into real `StructError` when needed.
 *
 * ```js
 * {
 *   type: 'number',
 *   value: 'invalid',
 *   path: [1],
 *   branch: [
 *     [1, 'invalid', 2],
 *     'invalid',
 *   ]
 * }
 */

export type Failure = {
  /**
   * The branch of values following a path down from the root.
   */

  branch: Branch

  /**
   * The path of indices to retrieve the failing value from the root.
   */

  path: Path

  /**
   * The failing value.
   */

  value: any

  /**
   * The expected type description of the failing value, or `undefined` if it
   * didn't have an expected type.
   */

  type: string | undefined

  /**
   * Failures can also be augmented with any of your on custom properties.
   */

  [key: string]: any
}
