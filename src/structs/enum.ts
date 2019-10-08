import invariant from 'tiny-invariant'
import { Struct, StructOptions } from '../struct'
import { createFunction } from './'

export const createEnum = (
  schema: any[],
  defaults: any,
  options: StructOptions
): Struct => {
  invariant(
    Array.isArray(schema),
    `Enum structs must be defined as an array, but you passed: ${schema}`
  )

  const validator = (value: any) => schema.includes(value)
  const Struct = createFunction(validator, defaults, options)
  Struct.kind = 'enum'
  Struct.type = schema
    .map(s => (typeof s === 'string' ? `"${s}"` : `${s}`))
    .join(' | ')
  return Struct
}
