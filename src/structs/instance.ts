import invariant from 'tiny-invariant'
import { Struct, Superstruct } from '..'

export const createInstance = (
  schema: any,
  defaults: any,
  struct: Superstruct
): Struct => {
  invariant(
    typeof schema === 'function',
    `Instance structs must be defined as a function, but you passed: ${schema}`
  )

  const validator = (value: any) => value instanceof schema
  const Struct = struct(validator, defaults)
  Struct.kind = 'instance'
  Struct.type = `instance<${schema.name}>`
  return Struct
}
