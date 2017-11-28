
import StructError from './struct-error'
import superstruct from './superstruct'

/**
 * Create a simple `struct` method for the default types.
 *
 * @type {Function}
 */

const struct = superstruct()

/**
 * Export.
 *
 * @type {Function}
 */

export { struct, superstruct, StructError }
