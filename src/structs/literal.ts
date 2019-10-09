import { Struct, Superstruct } from '..'

export const createLiteral = (
  schema: any,
  defaults: any,
  struct: Superstruct
): Struct => {
  const validator = (value: any) => value === schema
  const Struct = struct(validator, defaults)
  Struct.kind = 'literal'
  Struct.type = typeof schema === 'string' ? `"${schema}"` : `${schema}`
  return Struct
}
