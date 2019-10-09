import { isStruct, Struct, Superstruct } from '..'

export const createShorthand = (
  schema: any,
  defaults: any,
  struct: Superstruct
): Struct => {
  if (isStruct(schema)) {
    return schema
  }

  if (Array.isArray(schema)) {
    if (schema.length === 1) {
      const [first] = schema
      return struct.array([first], defaults)
    } else if (schema.length > 1) {
      return struct.tuple(schema, defaults)
    }
  }

  if (typeof schema === 'function') {
    return struct.function(schema, defaults)
  }

  if (typeof schema === 'object') {
    return struct.object(schema, defaults)
  }

  if (typeof schema === 'string') {
    let optional = false
    let Struct

    if (schema.endsWith('?')) {
      optional = true
      schema = schema.slice(0, -1)
    }

    if (schema.includes('|')) {
      const scalars = schema.split(/\s*\|\s*/g)
      Struct = struct.union(scalars, defaults)
    } else if (schema.includes('&')) {
      const scalars = schema.split(/\s*&\s*/g)
      Struct = struct.intersection(scalars, defaults)
    } else {
      Struct = struct.scalar(schema, defaults)
    }

    if (optional) {
      Struct = struct.union([Struct, 'undefined'], undefined)
    }

    return Struct
  }

  throw new Error(
    `A schema definition must be an object, array, string or function, but you passed: ${schema}`
  )
}
