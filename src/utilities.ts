import { Struct, StructType, StructContext } from './struct'
import { ObjectSchema, InferObjectStruct, Assign } from './xtras'
import { object, optional } from './types'

/**
 * Combine properties from multiple object structs, like `Object.assign`.
 */

export function assign<A extends ObjectSchema, B extends ObjectSchema>(
  Structs: [InferObjectStruct<A>, InferObjectStruct<B>]
): InferObjectStruct<Assign<A, B>>
export function assign(Structs: Struct<any>[]): any {
  const schemas = Structs.map((s) => s.schema)
  const schema = Object.assign({}, ...schemas)
  return object(schema)
}

/**
 * Validate that a value dynamically, determing which struct to use at runtime.
 */

export function dynamic<T>(
  fn: (value: unknown, ctx: StructContext) => Struct<T>
): Struct<T> {
  return struct('Dynamic<...>', (value, ctx) => {
    return ctx.check(value, fn(value, ctx))
  })
}

/**
 * Validate a value lazily, by constructing the struct right before the first
 * validation. This is useful for cases where you want to have self-referential
 * structs for nested data structures.
 */

export function lazy<T>(fn: () => Struct<T>): Struct<T> {
  let S: Struct<T> | undefined

  return struct('Lazy<...>', (value, ctx) => {
    if (!S) {
      S = fn()
    }

    return ctx.check(value, S)
  })
}

/**
 * Validates that a value is an object without a subset of properties.
 */

export function omit<S extends ObjectSchema, K extends keyof S>(
  struct: InferObjectStruct<S>,
  keys: K[]
): InferObjectStruct<Omit<S, K>> {
  const { schema } = struct
  const subschema: any = { ...schema }

  for (const key of keys) {
    delete subschema[key]
  }

  return object(subschema as Omit<S, K>)
}

/**
 * Validate that a partial object with specific entry values.
 */

export function partial<S extends ObjectSchema>(
  struct: InferObjectStruct<S> | S
): InferObjectStruct<{ [K in keyof S]: Struct<StructType<S[K]> | undefined> }> {
  const schema: any =
    struct instanceof Struct ? { ...struct.schema } : { ...struct }

  for (const key in schema) {
    schema[key] = optional(schema[key])
  }

  return object(schema) as any
}

/**
 * Validates that a value is an object with a subset of properties.
 */

export function pick<S extends ObjectSchema, K extends keyof S>(
  struct: InferObjectStruct<S>,
  keys: K[]
): InferObjectStruct<Pick<S, K>> {
  const { schema } = struct
  const subschema: any = {}

  for (const key of keys) {
    subschema[key] = schema[key]
  }

  return object(subschema as Pick<S, K>)
}

/**
 * Define a `Struct` instance with a type and validation function.
 */

export function struct<T>(
  name: string,
  validator: Struct<T>['validator']
): Struct<T, null> {
  return new Struct({ type: name, validator, schema: null })
}
