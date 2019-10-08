import kindOf from 'kind-of'
import { Branch, Path, Failure } from './struct-error'

/**
 * Superstruct ships by default with an unopinionated set of scalar types that
 * express all of the data types that are built-in to JavaScript.
 */

export const Types = {
  /**
   * Matches any value other than `undefined`.
   *
   * ```js
   * 'anything'
   * true
   * ```
   */

  any: (value: any) => value !== undefined,

  /**
   * Matches an `arguments` object.
   *
   * ```js
   * arguments
   * ```
   */

  arguments: (value: any) => kindOf(value) === 'arguments',

  /**
   * Matches an `Array`.
   *
   * ```js
   * [1, 2, 3]
   * ```
   */

  array: (value: any) => kindOf(value) === 'array',

  /**
   * Matches a boolean.
   *
   * ```js
   * true
   * false
   * ```
   */

  boolean: (value: any) => kindOf(value) === 'boolean',

  /**
   * Matches a Node.js `Buffer`.
   *
   * ```js
   * Buffer.from('string')
   * ```
   */

  buffer: (value: any) => kindOf(value) === 'buffer',

  /**
   * Matches a **valid** `Date` object.
   *
   * ```js
   * new Date()
   * ```
   *
   * Note: Invalid `Date` objects that equal `NaN` are not matched.
   */

  date: (value: any) => kindOf(value) === 'date' && !isNaN(value),

  /**
   * Matches an error object.
   *
   * ```js
   * new Error()
   * ```
   */

  error: (value: any) => kindOf(value) === 'error',

  /**
   * Matches a `Float32Array` object.
   */

  float32array: (value: any) => kindOf(value) === 'float32array',

  /**
   * Matches a `Float64Array` object.
   */

  float64array: (value: any) => kindOf(value) === 'float64array',

  /**
   * Matches a function.
   *
   * ```js
   * () => {}
   * function () {}
   * ```
   */

  function: (value: any) => kindOf(value) === 'function',

  /**
   * Matches a generator function.
   *
   * ```js
   * function* () {}
   * ```
   */

  generatorfunction: (value: any) => kindOf(value) === 'generatorfunction',

  /**
   * Matches a `Int16Array` object.
   */

  int16array: (value: any) => kindOf(value) === 'int16array',

  /**
   * Matches a `Int32Array` object.
   */

  int32array: (value: any) => kindOf(value) === 'int32array',

  /**
   * Matches a `Int8Array` object.
   */

  int8array: (value: any) => kindOf(value) === 'int8array',

  /**
   * Matches a `Map` object.
   *
   * ```js
   * new Map()
   * ```
   */

  map: (value: any) => kindOf(value) === 'map',

  /**
   * Matches the `null` literal value.
   *
   * ```js
   * null
   * ```
   */

  null: (value: any) => kindOf(value) === 'null',

  /**
   * Matches a number.
   *
   * ```js
   * 42
   * ```
   */

  number: (value: any) => kindOf(value) === 'number',

  /**
   * Matches a plain object.
   *
   * ```js
   * { key: 'value' }
   * { something: true }
   * ```
   */

  object: (value: any) => kindOf(value) === 'object',

  /**
   * Matches a `Promise` object.
   *
   * ```js
   * Promise.resolve()
   * ```
   */

  promise: (value: any) => kindOf(value) === 'promise',

  /**
   * Matches a regular expression object.
   *
   * ```js
   * /a-z/g
   * ```
   */

  regexp: (value: any) => kindOf(value) === 'regexp',

  /**
   * Matches a `Set` object.
   *
   * ```js
   * new Set()
   * ```
   */

  set: (value: any) => kindOf(value) === 'set',

  /**
   * Matches a string.
   *
   * ```js
   * 'text'
   * ```
   */

  string: (value: any) => kindOf(value) === 'string',

  /**
   * Matches a `Symbol`.
   *
   * ```js
   * Symbol()
   * ```
   */

  symbol: (value: any) => kindOf(value) === 'symbol',

  /**
   * Matches a `Uint16Array` object.
   */

  uint16array: (value: any) => kindOf(value) === 'uint16array',

  /**
   * Matches a `Uint32Array` object.
   */

  uint32array: (value: any) => kindOf(value) === 'uint32array',

  /**
   * Matches a `Uint8Array` object.
   */

  uint8array: (value: any) => kindOf(value) === 'uint8array',

  /**
   * Matches a `Uint8ClampedArray` object.
   */

  uint8clampedarray: (value: any) => kindOf(value) === 'uint8clampedarray',

  /**
   * Matches the `undefined` literal value.
   *
   * ```js
   * undefined
   * ```
   */

  undefined: (value: any) => kindOf(value) === 'undefined',

  /**
   * Matches a `WeakMap` object.
   *
   * ```js
   * new WeakMap()
   * ```
   */

  weakmap: (value: any) => kindOf(value) === 'weakmap',

  /**
   * Matches a `WeakSet` object.
   *
   * ```js
   * new WeakSet()
   * ```
   */

  weakset: (value: any) => kindOf(value) === 'weakset',
}

/**
 * `Validator` functions allow developers to define their own scalar types for
 * Superstruct to validate against, and return an indication of what is invalid.
 *
 * ```js
 * import { superstruct } from 'superstruct'
 * import isEmail from 'is-email'
 *
 * const struct = superstruct({
 *   types: {
 *     email: value => isEmail(value) && value.length < 256,
 *   }
 * })
 * ```
 */

export type Validator = (
  value: any,
  branch: Branch,
  path: Path
) => Partial<Failure>[] | Partial<Failure> | boolean
