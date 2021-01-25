import { Struct, Context, Validator, SimpleValidator } from '../struct'
import { object, optional } from './types'
import {
  ObjectSchema,
  Assign,
  ObjectType,
  PartialObjectSchema,
  ObjectError,
} from '../utils'
import { Error, GenericErrorDetail, TypeErrorDetail } from '../error'

/**
 * Create a new struct that combines the properties properties from multiple
 * object structs.
 *
 * Like JavaScript's `Object.assign` utility.
 */

export function assign<
  A extends ObjectSchema,
  B extends ObjectSchema,
  E1 extends Error,
  E2 extends Error
>(
  A: Struct<ObjectType<A>, A, E1>,
  B: Struct<ObjectType<B>, B, E2>
): Struct<ObjectType<Assign<A, B>>, Assign<A, B>, E1 | E2>
export function assign<
  A extends ObjectSchema,
  B extends ObjectSchema,
  C extends ObjectSchema,
  E1 extends Error,
  E2 extends Error,
  E3 extends Error
>(
  A: Struct<ObjectType<A>, A, E1>,
  B: Struct<ObjectType<B>, B, E2>,
  C: Struct<ObjectType<C>, C, E3>
): Struct<
  ObjectType<Assign<Assign<A, B>, C>>,
  Assign<Assign<A, B>, C>,
  E1 | E2 | E3
>
export function assign<
  A extends ObjectSchema,
  B extends ObjectSchema,
  C extends ObjectSchema,
  D extends ObjectSchema,
  E1 extends Error,
  E2 extends Error,
  E3 extends Error,
  E4 extends Error
>(
  A: Struct<ObjectType<A>, A, E1>,
  B: Struct<ObjectType<B>, B, E2>,
  C: Struct<ObjectType<C>, C, E3>,
  D: Struct<ObjectType<D>, D, E4>
): Struct<
  ObjectType<Assign<Assign<Assign<A, B>, C>, D>>,
  Assign<Assign<Assign<A, B>, C>, D>,
  E1 | E2 | E3 | E4
>
export function assign<
  A extends ObjectSchema,
  B extends ObjectSchema,
  C extends ObjectSchema,
  D extends ObjectSchema,
  E extends ObjectSchema,
  E1 extends Error,
  E2 extends Error,
  E3 extends Error,
  E4 extends Error,
  E5 extends Error
>(
  A: Struct<ObjectType<A>, A, E1>,
  B: Struct<ObjectType<B>, B, E2>,
  C: Struct<ObjectType<C>, C, E3>,
  D: Struct<ObjectType<D>, D, E4>,
  E: Struct<ObjectType<E>, E, E5>
): Struct<
  ObjectType<Assign<Assign<Assign<Assign<A, B>, C>, D>, E>>,
  Assign<Assign<Assign<Assign<A, B>, C>, D>, E>,
  E1 | E2 | E3 | E4 | E5
>
export function assign(...Structs: Struct<any, any, any>[]): any {
  const schemas = Structs.map((s) => s.schema)
  const schema = Object.assign({}, ...schemas)
  return object(schema)
}

/**
 * Define a new struct type with a custom validation function.
 */

// export function define<T, E extends Error>(
//   name: string,
//   validator: Validator<E>
// ): Struct<T, null, E> {
//   return new Struct({ type: name, schema: null, validator })
// }
export function define<T, E extends Error>(
  name: string,
  validator: Validator<E>
): Struct<T, null, E>
export function define<T>(
  name: string,
  validator: SimpleValidator
): Struct<T, null, GenericErrorDetail>
export function define(
  name: string,
  validator: Validator<any> | SimpleValidator
): Struct<any, any, any> {
  return new Struct({
    type: name,
    schema: null,
    validator(value, context) {
      const res = validator(value, context)
      if (res === false || typeof res === 'string') {
        return [
          {
            class: 'generic',
            message: res || 'error',
          },
        ] as GenericErrorDetail[]
      } else if (res === undefined || res === true) {
        return []
      }
      return res
    },
  })
}

/**
 * Create a struct with dynamic validation logic.
 *
 * The callback will receive the value currently being validated, and must
 * return a struct object to validate it with. This can be useful to model
 * validation logic that changes based on its input.
 */

export function dynamic<T, E extends Error>(
  fn: (value: unknown, ctx: Context) => Struct<T, any, E>
): Struct<T, null, E> {
  return new Struct({
    type: 'dynamic',
    schema: null,
    *entries(value, ctx) {
      const struct = fn(value, ctx)
      yield* struct.entries(value, ctx)
    },
    validator(value, ctx) {
      const struct = fn(value, ctx)
      return struct.validator(value, ctx)
    },
    coercer(value, ctx) {
      const struct = fn(value, ctx)
      return struct.coercer(value, ctx)
    },
  })
}

/**
 * Create a struct with lazily evaluated validation logic.
 *
 * The first time validation is run with the struct, the callback will be called
 * and must return a struct object to use. This is useful for cases where you
 * want to have self-referential structs for nested data structures to avoid a
 * circular definition problem.
 */

export function lazy<T, E extends Error>(
  fn: () => Struct<T, any, E>
): Struct<T, null, E> {
  let struct: Struct<T, any, E> | undefined
  return new Struct({
    type: 'lazy',
    schema: null,
    *entries(value, ctx) {
      struct ??= fn()
      yield* struct.entries(value, ctx)
    },
    validator(value, ctx) {
      struct ??= fn()
      return struct.validator(value, ctx)
    },
    coercer(value, ctx) {
      struct ??= fn()
      return struct.coercer(value, ctx)
    },
  })
}

/**
 * Create a new struct based on an existing object struct, but excluding
 * specific properties.
 *
 * Like TypeScript's `Omit` utility.
 */

export function omit<S extends ObjectSchema, K extends keyof S>(
  struct: Struct<ObjectType<S>, S, any>,
  keys: K[]
): Struct<
  ObjectType<Omit<S, K>>,
  Omit<S, K>,
  ObjectError<S> | TypeErrorDetail
> {
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
  struct: Struct<ObjectType<S>, S, any> | S
): Struct<
  ObjectType<PartialObjectSchema<S>>,
  PartialObjectSchema<S>,
  ObjectError<S>
> {
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
  struct: Struct<ObjectType<S>, S, any>,
  keys: K[]
): Struct<
  ObjectType<Pick<S, K>>,
  Pick<S, K>,
  ObjectError<S> | TypeErrorDetail
> {
  const { schema } = struct
  const subschema: any = {}

  for (const key of keys) {
    subschema[key] = schema[key]
  }

  return object(subschema as Pick<S, K>)
}

/**
 * Define a new struct type with a custom validation function.
 *
 * @deprecated This function has been renamed to `define`.
 */

export function struct<T, E extends Error>(
  name: string,
  validator: Validator<E>
): Struct<T, null, E> {
  console.warn(
    'superstruct@0.11 - The `struct` helper has been renamed to `define`.'
  )

  return define(name, validator)
}
