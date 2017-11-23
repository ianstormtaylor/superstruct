
import is from 'is'

/**
 * Default types.
 *
 * @type {Object}
 */

export default {
  any: v => v !== undefined,
  array: is.array,
  boolean: is.boolean,
  date: is.date,
  function: is.function,
  null: is.null,
  number: is.number,
  object: is.object,
  string: is.string,
  undefined: is.undefined,
}
