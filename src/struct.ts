import { Failure, Branch, Path, StructErrorConstructor } from './struct-error'
import { Validator } from './validators'

/**
 * `Struct` objects encapsulate the validation logic for a specific type of
 * struct (either custom or built-in) and context for building better errors.
 */

export interface Struct {
  (value: any): any
  kind: string
  type: string
  default(): any
  check(value: any, branch: Branch, path: Path): [Failure[]?, any?]
  assert(value: any): any
  test(value: any): boolean
  validate(value: any): [Error?, any?]
  fail(props: {
    value: any
    branch: Branch
    path: Path
    type?: string | null
  }): Failure
}

/**
 * `StructOptions` are passed in when creating a struct.
 */

export type StructOptions = {
  types: Record<string, Validator>
  Error: StructErrorConstructor
}

/**
 * A symbol to set on `Struct` objects to test them against later.
 */

export const STRUCT = Symbol('STRUCT')

/**
 * Check if a value is a `Struct` object.
 */

export const isStruct = (value: any): value is Struct => {
  return typeof value === 'function' && value[STRUCT]
}

/**
 * This abstract `Struct` factory creates a generic struct that validates values
 * against a `Validator` function.
 */

export const createStruct = (props: {
  kind: string
  type: string
  defaults: () => any
  options: StructOptions
}): Struct => {
  const { Error: ErrorConstructor } = props.options
  const Struct = (value: any): any => Struct.assert(value)

  // Set a hidden symbol property so that we can check it later to see if an
  // object is a struct object.
  Object.defineProperty(Struct, STRUCT, { value: true })

  Struct.kind = props.kind
  Struct.type = props.type

  Struct.default = () => {
    return typeof props.defaults === 'function'
      ? props.defaults()
      : props.defaults
  }

  Struct.test = (value: any): boolean => {
    const [failures] = Struct.check(value, [value], [])
    return !failures
  }

  Struct.assert = (value: any): any => {
    const [failures, result] = Struct.check(value, [value], [])

    if (failures) {
      throw new ErrorConstructor(failures)
    } else {
      return result
    }
  }

  Struct.validate = (value: any): [Error?, any?] => {
    const [failures, result] = Struct.check(value, [value], [])

    if (failures) {
      return [new ErrorConstructor(failures)]
    } else {
      return [undefined, result]
    }
  }

  Struct.check = (
    value: any = Struct.default(),
    branch: Branch,
    path: Path
  ): [Failure[]?, any?] => {
    const failures = [Struct.fail({ value, branch, path })]
    return [failures]
  }

  Struct.fail = (obj: {
    value: any
    branch: Branch
    path: Path
    type?: string | null
  }): Failure => {
    const { type = Struct.type, ...rest } = obj
    return { type, ...rest }
  }

  return Struct
}
