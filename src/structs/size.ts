import invariant from 'tiny-invariant'
import { createFunction } from '.'
import { Struct, StructOptions } from '../struct'

export const createSize = (
  schema: [number, number],
  defaults: any,
  options: StructOptions
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

  const Struct = createFunction(validator, defaults, options)
  Struct.kind = 'size'
  Struct.type = `size<${min},${max}>`
  return Struct
}
