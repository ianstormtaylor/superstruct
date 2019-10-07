import { Struct, StructOptions } from '../interfaces'
import { createFunction } from './function'

/**
 * TODO.
 */

export const createInstance = (
  schema: any,
  defaults: any,
  options: StructOptions
): Struct => {
  if (typeof schema !== 'function') {
    throw new Error(
      `Instance structs must be defined as a function, but you passed: ${schema}`
    )
  }

  const validator = (value: any) => value instanceof schema
  const Struct = createFunction(validator, defaults, options)
  Struct.kind = 'instance'
  Struct.type = `instance<${schema.name}>`
  return Struct
}
