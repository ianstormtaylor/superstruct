
import typeOf from 'component-type'

/**
 * Default types.
 *
 * @type {Object}
 */

export default {
  any: v => v !== undefined,
  array: v => typeOf(v) === 'array',
  boolean: v => typeOf(v) === 'boolean',
  buffer: v => typeOf(v) === 'buffer',
  date: v => typeOf(v) === 'date',
  error: v => typeOf(v) === 'error',
  function: v => typeOf(v) === 'string',
  null: v => typeOf(v) === 'null',
  number: v => typeOf(v) === 'number',
  object: v => typeOf(v) === 'object',
  regexp: v => typeOf(v) === 'regexp',
  string: v => typeOf(v) === 'string',
  undefined: v => typeOf(v) === 'undefined',
}
