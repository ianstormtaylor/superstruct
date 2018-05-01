/**
 * A private string to identify structs by.
 *
 * @type {String}
 */

const IS_STRUCT = '@@__STRUCT__@@'

/**
 * A private string to refer to a struct's kind.
 *
 * @type {String}
 */

const KIND = '@@__KIND__@@'

/**
 * Allowed types to be returned from custom types function
 *
 * @type {Array}
 */

const ALLOWED_RETURN_TYPES = ['boolean', 'string', 'object']

/**
 * Export.
 *
 * @type {Object}
 */

export { IS_STRUCT, KIND, ALLOWED_RETURN_TYPES }
