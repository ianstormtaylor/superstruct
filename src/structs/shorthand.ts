import { isStruct, Struct, StructOptions } from '../struct'
import {
  createArray,
  createFunction,
  createIntersection,
  createObject,
  createScalar,
  createTuple,
  createUnion,
} from './'

export const createShorthand = (
  schema: any,
  defaults: any,
  options: StructOptions
): Struct => {
  if (isStruct(schema)) {
    return schema
  }

  if (Array.isArray(schema)) {
    if (schema.length === 1) {
      const [first] = schema
      return createArray([first], defaults, options)
    } else if (schema.length > 1) {
      return createTuple(schema, defaults, options)
    }
  }

  if (typeof schema === 'function') {
    return createFunction(schema, defaults, options)
  }

  if (typeof schema === 'object') {
    return createObject(schema, defaults, options)
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
      Struct = createUnion(scalars, defaults, options)
    } else if (schema.includes('&')) {
      const scalars = schema.split(/\s*&\s*/g)
      Struct = createIntersection(scalars, defaults, options)
    } else {
      Struct = createScalar(schema, defaults, options)
    }

    if (optional) {
      Struct = createUnion([Struct, 'undefined'], undefined, options)
    }

    return Struct
  }

  throw new Error(
    `A schema definition must be an object, array, string or function, but you passed: ${schema}`
  )
}
