import { Struct, StructType, StructContext } from './struct'
import { ObjectSchema, InferObjectStruct, Assign } from './xtras'
import { object, optional } from './types'

/**
 * Create a new struct that combines the properties properties from multiple
 * object structs.
 *
 * Like JavaScript's `Object.assign` utility.
 */

export function assign<A extends ObjectSchema, B extends ObjectSchema>(
  Structs: [InferObjectStruct<A>, InferObjectStruct<B>]
): InferObjectStruct<Assign<A, B>>
export function assign<
  A extends ObjectSchema,
  B extends ObjectSchema,
  C extends ObjectSchema
>(
  Structs: [InferObjectStruct<A>, InferObjectStruct<B>, InferObjectStruct<C>]
): InferObjectStruct<Assign<Assign<A, B>, C>>
export function assign<
  A extends ObjectSchema,
  B extends ObjectSchema,
  C extends ObjectSchema,
  D extends ObjectSchema
>(
  Structs: [
    InferObjectStruct<A>,
    InferObjectStruct<B>,
    InferObjectStruct<C>,
    InferObjectStruct<D>
  ]
): InferObjectStruct<Assign<Assign<Assign<A, B>, C>, D>>
export function assign<
  A extends ObjectSchema,
  B extends ObjectSchema,
  C extends ObjectSchema,
  D extends ObjectSchema,
  E extends ObjectSchema
>(
  Structs: [
    InferObjectStruct<A>,
    InferObjectStruct<B>,
    InferObjectStruct<C>,
    InferObjectStruct<D>,
    InferObjectStruct<E>
  ]
): InferObjectStruct<Assign<Assign<Assign<Assign<A, B>, C>, D>, E>>
export function assign(Structs: Struct<any>[]): any {
  const schemas = Structs.map((s) => s.schema)
  const schema = Object.assign({}, ...schemas)
  return object(schema)
}

/**
 * Create a struct with dynamic, runtime validation.
 *
 * The callback will receive the value currently being validated, and must
 * return a struct object to validate it with. This can be useful to model
 * validation logic that changes based on its input.
 */

export function dynamic<T>(
  fn: (value: unknown, ctx: StructContext) => Struct<T>
): Struct<T> {
  return struct('Dynamic<...>', (value, ctx) => {
    return ctx.check(value, fn(value, ctx))
  })
}

/**
 * Create a struct with lazily evaluated validation.
 *
 * The first time validation is run with the struct, the callback will be called
 * and must return a struct object to use. This is useful for cases where you
 * want to have self-referential structs for nested data structures to avoid a
 * circular definition problem.
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
 * Create a new struct based on an existing object struct, but excluding
 * specific properties.
 *
 * Like TypeScript's `Omit` utility.
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
 * Create a new struct based on an existing object struct, but with all of its
 * properties allowed to be `undefined`.
 *
 * Like TypeScript's `Partial` utility.
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
 * Create a new struct based on an existing object struct, but only including
 * specific properties.
 *
 * Like TypeScript's `Pick` utility.
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
 * Create a new struct with a custom validation function.
 */

export function struct<T>(
  name: string,
  validator: Struct<T>['validator']
): Struct<T, null> {
  return new Struct({ type: name, validator, schema: null })
}
