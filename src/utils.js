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
 * Resolve `defaults`, for an optional `value`.
 *
 * @param {Function|Any} defaults
 * @param {Any} value
 * @return {Any}
 */

export function resolveDefaults(defaults, value) {
  return typeof defaults === 'function' ? defaults(value) : defaults
}
