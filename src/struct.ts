import { Failure, Branch, Path, StructErrorConstructor } from './struct-error'
import { Validator } from './types'

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
    type?: string
  }): Failure => {
    return { ...obj, type: 'type' in obj ? obj.type : Struct.type }
  }

  return Struct
}

/**
 * `Struct` validators encapsulate the validation logic for a specific type of
 * data (either custom or built-in). They have a set of methods that allow you
 * to validate input in various ways, while producing detailed errors.
 *
 * They are created by the [[Superstruct]] factory functions. You can call them
 * directly for the simple case, or use one of their validation methods.
 *
 * ```js
 * const Struct = struct({
 *   id: 'number',
 *   name: 'string',
 * })
 *
 * const result = Struct(data) // Throws if invalid!
 *
 * const [error, result] = Struct.validate(data)
 *
 * if (Struct.test(data)) {
 *    // ...
 * }
 * ```
 */

export interface Struct {
  /**
   * All structs are functions that are shorthand for calling [[Struct.assert]].
   */

  (value: any): any

  /**
   * The struct's name.
   *
   * ```js
   * 'object'
   * 'union'
   * 'email'
   * ```
   */

  kind: string

  /**
   * A string representing the type of the struct. These strings are purely for
   * user-facing error messages, and aren't canonical. They are similar to the
   * syntax that TypeScript uses.
   *
   * ```js
   * '{id,name,email}'
   * 'string | number'
   * 'email'
   * ```
   */

  type: string

  /**
   * Get the default value for a struct.
   *
   * ```js
   * const defaults = Struct.default()
   * ```
   */

  default(): any

  /**
   * Run the low-level validation function a struct, returning a tuple that
   * contains either a list of [[Failure]] objects, or a resulting value.
   *
   * This method is fairly low-level and not for normal use.
   *
   * ```js
   * const [failures, result] = Struct.check(value, branch, path)
   * ```
   */

  check(value: any, branch: Branch, path: Path): [Failure[]?, any?]

  /**
   * Validate a `value`, returning the resulting value, and throwing an error if
   * validation fails.
   *
   * ```js
   * try {
   *   const result = Struct.assert(value)
   *   // ...
   * } catch (e) {
   *   // ...
   * }
   * ```
   */

  assert(value: any): any

  /**
   * Validate a `value`, returning a boolean indicating whether it's valid.
   *
   * Note: Using this method does not give you access to the defaults that may
   * be associated with a struct, so it doesn't guarantee that the value you
   * have passes, just that the value with defaults passes.
   *
   * ```js
   * if (Struct.test(value)) {
   *   // ...
   * }
   * ```
   */

  test(value: any): boolean

  /**
   * Validate a `value` returning a tuple containing an error if the validation
   * fails, or the resulting value if it succeeds.
   *
   * ```js
   * const [error, result] = Struct.validate(value)
   * ```
   */

  validate(value: any): [Error?, any?]

  /**
   * Create a low-level [[Failure]] object for the struct.
   *
   * ```js
   * const failure = Struct.fail({ value, branch, path })
   * ```
   */

  fail(obj: { value: any; branch: Branch; path: Path; type?: string }): Failure
}

/**
 * `StructOptions` are passed in when creating a struct.
 */

export type StructOptions = {
  types: Record<string, Validator>
  Error: StructErrorConstructor
}
