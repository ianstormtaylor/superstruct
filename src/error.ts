/**
 * A `StructFailure` represents a single specific failure in validation.
 */

export type Failure = {
  value: any
  key: any
  type: string
  refinement: string | undefined
  message: string
  branch: Array<any>
  path: Array<any>
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
  key!: any
  type!: string
  refinement!: string | undefined
  path!: Array<any>
  branch!: Array<any>
  failures: () => Array<Failure>;
  [x: string]: any

  constructor(failure: Failure, failures: () => Generator<Failure>) {
    let cached: Array<Failure> | undefined
    const { message, ...rest } = failure
    const { path } = failure
    const msg =
      path.length === 0 ? message : `At path: ${path.join('.')} -- ${message}`
    super(msg)
    Object.assign(this, rest)
    this.name = this.constructor.name
    this.failures = () => {
      return (cached ??= [failure, ...failures()])
    }
  }
}
