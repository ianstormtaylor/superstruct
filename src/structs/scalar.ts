import invariant from 'tiny-invariant'
import { Struct, Superstruct } from '..'

export const createScalar = (
  schema: string,
  defaults: any,
  struct: Superstruct
): Struct => {
  invariant(
    typeof schema === 'string',
    `Scalar structs must be defined as a string, but you passed: ${schema}`
  )

  const { Types } = struct

  invariant(
    schema in Types,
    `No struct validator function found for type "${schema}".`
  )

  const Struct = struct(Types[schema], defaults)
  Struct.kind = 'scalar'
  Struct.type = schema
  return Struct
}
