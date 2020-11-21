/**
 * A `StructFailure` represents a single specific failure in validation.
 */

export type Failure = {
  value: any
  key: string | number | undefined
  type: string
  refinement: string | undefined
  message: string
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
  failures: () => Array<Failure>;
  [key: string]: any

  constructor(failure: Failure, moreFailures: IterableIterator<Failure>) {
    const {
      path,
      value,
      key,
      type,
      message,
      refinement,
      branch,
      ...rest
    } = failure
    let failures: Array<Failure> | undefined
    const msg =
      path.length === 0 ? message : `At path: ${path.join('.')} -- ${message}`
    super(msg)
    Object.assign(this, rest)
    this.name = this.constructor.name
    this.value = value
    this.key = key
    this.type = type
    this.refinement = refinement
    this.path = path
    this.branch = branch
    this.failures = (): Array<Failure> => {
      if (!failures) {
        failures = [failure, ...moreFailures]
      }

      return failures
    }
  }
}
