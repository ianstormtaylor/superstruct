import invariant from 'tiny-invariant'
import { Struct, Superstruct } from '..'

export const createSize = (
  schema: [number, number],
  defaults: any,
  struct: Superstruct
): Struct => {
  invariant(
    Array.isArray(schema) &&
      schema.length === 2 &&
      schema.every(n => typeof n === 'number'),
    `Size structs must be defined as an array with two number elements, but you passed: ${schema}`
  )

  const [min, max] = schema
  const validator = (value: any) =>
    value != null &&
    typeof value.length === 'number' &&
    value.length >= min &&
    value.length <= max

  const Struct = struct(validator, defaults)
  Struct.kind = 'size'
  Struct.type = `size<${min},${max}>`
  return Struct
}
