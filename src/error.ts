/**
 * A `StructFailure` represents a single specific failure in validation.
 */

export type Failure<E extends Error> = {
  value: any
  key: any
  type: string
  refinement: string | undefined
  message: string
  branch: Array<any>
  path: Array<any>
  detail: E
  failures?: Failure<E>[]
}

export type Error = ErrorDetail | never
export interface ErrorDetail {
  class: string
  message?: string
}
export interface BasicErrorDetail extends ErrorDetail {
  class: 'basic'
  except: string
  actually: string
}

export interface TypeErrorDetail extends ErrorDetail {
  class: 'type'
  except: string
  actually: unknown
}

export interface ValuesErrorDetail<T> extends ErrorDetail {
  class: 'values'
  except: T[]
  actually: T
}

export interface ValueErrorDetail<T> extends ErrorDetail {
  class: 'value'
  except: T
  actually: unknown
}

export interface ThrowErrorDetail extends ErrorDetail {
  class: 'throw'
  error: any
}

/**
 * `StructError` objects are thrown (or returned) when validation fails.
 *
 * Validation logic is design to exit early for maximum performance. The error
 * represents the first error encountered during validation. For more detail,
 * the `error.failures` property is a generator function that can be run to
 * continue validation and receive all the failures in the data.
 */

export class StructError<E extends Error> extends TypeError {
  value: any
  key!: any
  type!: string
  refinement!: string | undefined
  path!: Array<any>
  branch!: Array<any>
  failures: () => Array<Failure<E>>
  detail: E;
  [x: string]: any

  constructor(failure: Failure<E>, failures: () => Generator<Failure<E>>) {
    let cached: Array<Failure<E>> | undefined
    const { message, ...rest } = failure
    const { path, detail } = failure
    const msg =
      path.length === 0 ? message : `At path: ${path.join('.')} -- ${message}`
    super(msg)
    Object.assign(this, rest)
    this.detail = detail
    this.name = this.constructor.name
    this.failures = () => {
      return (cached ??= [failure, ...failures()])
    }
  }
}
