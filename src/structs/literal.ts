import { Struct, StructOptions } from '../interfaces'
import { createFunction } from './function'

/**
 * Literal structs validate their input against a literal value.
 */

export const createLiteral = (
  schema: any,
  defaults: any,
  options: StructOptions
): Struct => {
  const validator = (value: any) => value === schema
  const Struct = createFunction(validator, defaults, options)
  Struct.kind = 'literal'
  Struct.type = typeof schema === 'string' ? `"${schema}"` : `${schema}`
  return Struct
}
