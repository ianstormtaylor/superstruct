import invariant from 'tiny-invariant'
import { Struct, Superstruct } from '..'

export const createEnum = (
  schema: any[],
  defaults: any,
  struct: Superstruct
): Struct => {
  invariant(
    Array.isArray(schema),
    `Enum structs must be defined as an array, but you passed: ${schema}`
  )

  const validator = (value: any) => schema.includes(value)
  const Struct = struct(validator, defaults)
  Struct.kind = 'enum'
  Struct.type = schema
    .map(s => (typeof s === 'string' ? `"${s}"` : `${s}`))
    .join(' | ')
  return Struct
}
