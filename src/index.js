
import StructError from './error'
import superstruct from './superstruct'
import { isStruct } from './utils'

/**
 * Create a convenience `struct` factory for the default types.
 *
 * @type {Function}
 */

const struct = superstruct()

/**
 * Export.
 *
 * @type {Function}
 */

export {
  struct,
  superstruct,
  isStruct,
  StructError,
}
