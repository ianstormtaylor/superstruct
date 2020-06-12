import { Struct } from './struct'

/**
 * A `StructContext` contains information about the current value being
 * validated as well as helper functions for failures and recursive validating.
 */

export type Context = {
  value: any
  type: string
  branch: Array<any>
  path: Array<string | number>
  fail: (props?: Partial<Failure>) => Failure
  check: <T, S>(
    value: any,
    struct: Struct<T, S>,
    parent?: any,
    key?: string | number
  ) => Iterable<Failure>
}

/**
 * A `StructFailure` represents a single specific failure in validation.
 */

export type Failure = {
  value: Context['value']
  type: Context['type']
  branch: Context['branch']
  path: Context['path']
  [key: string]: any
}

/**
 * A type utility to extract the type from a `Struct` class.
 */

export type Infer<T extends Struct<any, any>> = T['TYPE']

/**
 * A `StructResult` is returned from validation functions.
 */

export type Result = boolean | Iterable<Failure>
