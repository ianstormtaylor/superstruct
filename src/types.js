import kindOf from 'kind-of'

/**
 * The types that `kind-of` supports.
 *
 * @type {Array}
 */

const TYPES = [
  'arguments',
  'array',
  'boolean',
  'buffer',
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
  'promise',
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

const Types = {
  any: value => value !== undefined,
}

TYPES.forEach(type => {
  Types[type] = value => kindOf(value) === type
})

/**
 * Handle the 'date' case specially, to throw out invalid `Date` objects.
 *
 * @param {Mixed} value
 * @return {Boolean}
 */

Types.date = value => kindOf(value) === 'date' && !isNaN(value)

/**
 * Export.
 *
 * @type {Object}
 */

export default Types
