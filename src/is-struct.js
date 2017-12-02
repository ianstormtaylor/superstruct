
import { IS_STRUCT } from './constants'

/**
 * Check if a `value` is a struct.
 *
 * @param {Any} value
 * @return {Boolean}
 */

function isStruct(value) {
  return !!(value && value[IS_STRUCT])
}

/**
 * Export.
 *
 * @type {Function}
 */

export default isStruct
