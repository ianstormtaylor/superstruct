import invariant from 'tiny-invariant'
import { Struct, StructOptions } from '../struct'
import { createFunction } from './'

export const createInstance = (
  schema: any,
  defaults: any,
  options: StructOptions
): Struct => {
  invariant(
    typeof schema === 'function',
    `Instance structs must be defined as a function, but you passed: ${schema}`
  )

  const validator = (value: any) => value instanceof schema
  const Struct = createFunction(validator, defaults, options)
  Struct.kind = 'instance'
  Struct.type = `instance<${schema.name}>`
  return Struct
}
