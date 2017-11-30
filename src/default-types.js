
import typeOf from 'kind-of'

/**
 * Type strings.
 *
 * @type {Array}
 */

const TYPES = [
  'array',
  'boolean',
  'buffer',
  'date',
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
 * Default types.
 *
 * @type {Object}
 */

const DEFAULT_TYPES = {
  any: value => value !== undefined,
}

TYPES.forEach((type) => {
  DEFAULT_TYPES[type] = value => typeOf(value) === type
})

/**
 * Export.
 *
 * @type {Object}
 */

export default DEFAULT_TYPES
