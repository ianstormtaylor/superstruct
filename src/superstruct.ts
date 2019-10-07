import Builtins from './builtins'
import {
  Branch,
  Path,
  Struct,
  Superstruct,
  SuperstructOptions,
  Validator,
} from './interfaces'
import {
  createArray,
  createDynamic,
  createEnum,
  createFunction,
  createInstance,
  createInterface,
  createIntersection,
  createLazy,
  createLiteral,
  createObject,
  createRecord,
  createScalar,
  createShorthand,
  createPick,
  createTuple,
  createUnion,
} from './structs'

/**
 * Create a struct factory with a configuration of types.
 */

export const superstruct = (config: SuperstructOptions = {}): Superstruct => {
  const types = {
    ...Builtins,
    ...(config.types || {}),
  }

  const struct = (schema: any, defaults: any, options: {} = {}): Struct => {
    return createShorthand(schema, defaults, { ...options, types })
  }

  struct.array = (schema: [any], defaults: any, options: {}): Struct => {
    return createArray(schema, defaults, { ...options, types })
  }

  struct.dynamic = (
    schema: (value: any, branch: Branch, path: Path) => Struct,
    defaults: any,
    options: {}
  ): Struct => {
    return createDynamic(schema, defaults, { ...options, types })
  }

  struct.enum = (schema: any[], defaults: any, options: {}): Struct => {
    return createEnum(schema, defaults, { ...options, types })
  }

  struct.function = (schema: Validator, defaults: any, options: {}): Struct => {
    return createFunction(schema, defaults, { ...options, types })
  }

  struct.instance = (schema: any, defaults: any, options: {}): Struct => {
    return createInstance(schema, defaults, { ...options, types })
  }

  struct.interface = (schema: any, defaults: any, options: {}): Struct => {
    return createInterface(schema, defaults, { ...options, types })
  }

  struct.intersection = (schema: any[], defaults: any, options: {}): Struct => {
    return createIntersection(schema, defaults, { ...options, types })
  }

  struct.lazy = (schema: () => Struct, defaults: any, options: {}): Struct => {
    return createLazy(schema, defaults, { ...options, types })
  }

  struct.literal = (schema: any, defaults: any, options: {}): Struct => {
    return createLiteral(schema, defaults, { ...options, types })
  }

  struct.object = (schema: {}, defaults: any, options: {}): Struct => {
    return createObject(schema, defaults, { ...options, types })
  }

  struct.optional = (schema: any, defaults: any, options: {}): Struct => {
    return createUnion([schema, 'undefined'], defaults, { ...options, types })
  }

  struct.pick = (schema: {}, defaults: any, options: {}): Struct => {
    return createPick(schema, defaults, { ...options, types })
  }

  struct.record = (schema: [any, any], defaults: any, options: {}): Struct => {
    return createRecord(schema, defaults, { ...options, types })
  }

  struct.scalar = (schema: string, defaults: any, options: {}): Struct => {
    return createScalar(schema, defaults, { ...options, types })
  }

  struct.tuple = (schema: any[], defaults: any, options: {}): Struct => {
    return createTuple(schema, defaults, { ...options, types })
  }

  struct.union = (schema: any[], defaults: any, options: {}): Struct => {
    return createUnion(schema, defaults, { ...options, types })
  }

  struct.record = (schema: any, defaults: any, options: {}) => {
    return createRecord(schema, defaults, { ...options, types })
  }

  return struct
}
