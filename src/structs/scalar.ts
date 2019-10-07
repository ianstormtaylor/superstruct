import { Struct, StructOptions } from '../interfaces'
import { createFunction } from './function'

/**
 * TODO.
 */

export const createScalar = (
  schema: string,
  defaults: any,
  options: StructOptions
): Struct => {
  if (typeof schema !== 'string') {
    throw new Error(
      `Scalar structs must be defined as a string, but you passed: ${schema}`
    )
  }

  const { types } = options

  if (!(schema in types)) {
    throw new Error(`No struct validator function found for type "${schema}".`)
  }

  const validator = types[schema]
  const Struct = createFunction(validator, defaults, options)
  Struct.kind = 'scalar'
  Struct.type = schema
  return Struct
}
