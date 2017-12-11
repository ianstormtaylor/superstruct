
import { IS_STRUCT } from './constants'

/**
 * Check if a `value` is a struct.
 *
 * @param {Any} value
 * @return {Boolean}
 */

export function isStruct(value) {
  return !!(value && value[IS_STRUCT])
}

/**
 * Resolve a `defaults` value.
 *
 * @param {Function|Any} defaults
 * @return {Any}
 */

export function resolveDefaults(defaults) {
  return typeof defaults === 'function' ? defaults() : defaults
}
