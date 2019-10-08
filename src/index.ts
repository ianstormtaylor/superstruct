import { superstruct } from './superstruct'

/**
 * The singleton instance of Superstruct that is exported by default, configured
 * with types for all of the JavaScript built-in data types.
 *
 * You can use it if you don't need any custom types. However, if you do want to
 * define custom types, use the [[superstruct]] factory to configure your own
 * [[Superstruct]] instance.
 */

const struct = superstruct()

export { struct, superstruct }
export { Superstruct } from './superstruct'
export { StructError, Failure, Path, Branch } from './struct-error'
export { Types, Validator } from './types'
export { isStruct, Struct } from './struct'
