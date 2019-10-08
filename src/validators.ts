import kindOf from 'kind-of'
import { Branch, Path, Failure } from './struct-error'

/**
 * `Validator` functions allow developers to define their own types for
 * Superstruct to validate against, and return an indication of what is invalid.
 */

export type Validator = (
  value: any,
  branch: Branch,
  path: Path
) => Partial<Failure>[] | Partial<Failure> | string | boolean

/**
 * Superstruct ships by default with an unopinionated set of types that express
 * all of the data types that are built-in to JavaScript.
 *
 * For data types outside of this set, users can define their own custom
 * validator functions and configure Superstruct to use them..
 */

export const VALIDATORS = {
  any: (value: any) => value !== undefined,
  arguments: (value: any) => kindOf(value) === 'arguments',
  array: (value: any) => kindOf(value) === 'array',
  boolean: (value: any) => kindOf(value) === 'boolean',
  buffer: (value: any) => kindOf(value) === 'buffer',
  // COMPAT: Dates are special-cased to throw out invalid `Date` objects.
  date: (value: any) => kindOf(value) === 'date' && !isNaN(value),
  error: (value: any) => kindOf(value) === 'error',
  float32array: (value: any) => kindOf(value) === 'float32array',
  float64array: (value: any) => kindOf(value) === 'float64array',
  function: (value: any) => kindOf(value) === 'function',
  generatorfunction: (value: any) => kindOf(value) === 'generatorfunction',
  int16array: (value: any) => kindOf(value) === 'int16array',
  int32array: (value: any) => kindOf(value) === 'int32array',
  int8array: (value: any) => kindOf(value) === 'int8array',
  map: (value: any) => kindOf(value) === 'map',
  null: (value: any) => kindOf(value) === 'null',
  number: (value: any) => kindOf(value) === 'number',
  object: (value: any) => kindOf(value) === 'object',
  promise: (value: any) => kindOf(value) === 'promise',
  regexp: (value: any) => kindOf(value) === 'regexp',
  set: (value: any) => kindOf(value) === 'set',
  string: (value: any) => kindOf(value) === 'string',
  symbol: (value: any) => kindOf(value) === 'symbol',
  uint16array: (value: any) => kindOf(value) === 'uint16array',
  uint32array: (value: any) => kindOf(value) === 'uint32array',
  uint8array: (value: any) => kindOf(value) === 'uint8array',
  uint8clampedarray: (value: any) => kindOf(value) === 'uint8clampedarray',
  undefined: (value: any) => kindOf(value) === 'undefined',
  weakmap: (value: any) => kindOf(value) === 'weakmap',
  weakset: (value: any) => kindOf(value) === 'weakset',
}
