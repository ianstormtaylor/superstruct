import invariant from 'tiny-invariant'
import { Struct, StructOptions } from '../struct'
import { createFunction } from './'

export const createScalar = (
  schema: string,
  defaults: any,
  options: StructOptions
): Struct => {
  invariant(
    typeof schema === 'string',
    `Scalar structs must be defined as a string, but you passed: ${schema}`
  )

  const { types } = options

  invariant(
    schema in types,
    `No struct validator function found for type "${schema}".`
  )

  const validator = types[schema]
  const Struct = createFunction(validator, defaults, options)
  Struct.kind = 'scalar'
  Struct.type = schema
  return Struct
}
