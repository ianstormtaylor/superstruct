
import kindOf from 'kind-of'

/**
 * The types that `kind-of` supports..
 *
 * @type {Array}
 */

const KIND_OF_TYPES = [
  'arguments',
  'array',
  'boolean',
  'buffer',
  'date',
  'error',
  'float32array',
  'float64array',
  'function',
  'generatorfunction',
  'int16array',
  'int32array',
  'int8array',
  'map',
  'null',
  'number',
  'object',
  'regexp',
  'set',
  'string',
  'symbol',
  'uint16array',
  'uint32array',
  'uint8array',
  'uint8clampedarray',
  'undefined',
  'weakmap',
  'weakset',
]

/**
 * The default types that Superstruct ships with.
 *
 * @type {Object}
 */

const TYPES = {
  any: value => value !== undefined,
}

KIND_OF_TYPES.forEach((type) => {
  TYPES[type] = value => kindOf(value) === type
})

/**
 * Export.
 *
 * @type {Object}
 */

export default TYPES
