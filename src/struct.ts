import { StructError } from './error'
import { Branch, Failure, Path, Struct, StructOptions } from './interfaces'

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
  const { kind, type, defaults, options } = props
  const Struct = (value: any): any => Struct.assert(value)

  // Set a hidden symbol property so that we can check it later to see if an
  // object is a struct object.
  Object.defineProperty(Struct, STRUCT, { value: true })

  Struct.kind = kind
  Struct.type = type
  Struct.options = options

  Struct.default = () => {
    return typeof defaults === 'function' ? defaults() : defaults
  }

  Struct.test = (value: any): boolean => {
    const [failures] = Struct.check(value, [value], [])
    return !failures
  }

  Struct.assert = (value: any): any => {
    const [failures, result] = Struct.check(value, [value], [])

    if (failures) {
      throw new StructError(failures)
    } else {
      return result
    }
  }

  Struct.validate = (value: any): [StructError?, any?] => {
    const [failures, result] = Struct.check(value, [value], [])

    if (failures) {
      return [new StructError(failures)]
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

  Struct.fail = (props: {
    value: any
    branch: Branch
    path: Path
    type?: string | null
    reason?: string | null
  }): Failure => {
    const { value, branch, path, type = Struct.type, reason = null } = props
    return { type, value, path, branch, reason }
  }

  return Struct
}
