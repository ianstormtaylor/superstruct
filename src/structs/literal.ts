import { Struct, StructOptions } from '../struct'
import { createFunction } from './'

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
