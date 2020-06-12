import {
  Struct,
  StructResult,
  StructFailure,
  StructContext,
  StructType,
} from './struct'

export type StructRecord<T> = Record<string, Struct<T>>
export type StructTuple<T> = { [K in keyof T]: Struct<T[K]> }

/**
 * Convert a validation result to an iterable of failures.
 */

export function toFailures(
  result: StructResult,
  context: StructContext
): Iterable<StructFailure> {
  if (result === true) {
    return []
  } else if (result === false) {
    return [context.fail()]
  } else {
    return result
  }
}

/**
 * A schema for tuple structs.
 */

export type TupleSchema<T> = { [K in keyof T]: Struct<T[K]> }

/**
 * A schema for object structs.
 */

export type ObjectSchema = Record<string, Struct<any>>

/**
 * Infer a type from an object struct schema.
 */

export type InferObjectType<S extends ObjectSchema> = Simplify<
  Optionalize<{ [K in keyof S]: StructType<S[K]> }>
>

/**
 * Infer a struct type from an object struct schema.
 */

export type InferObjectStruct<S extends ObjectSchema> = Struct<
  InferObjectType<S>,
  S
>

/**
 * Normalize properties of a type that allow `undefined` to make them optional.
 */

type Optionalize<S extends object> = OmitBy<S, undefined> &
  Partial<PickBy<S, undefined>>

/**
 * Omit properties from a type that extend from a specific type.
 */

type OmitBy<T, V> = Omit<
  T,
  { [K in keyof T]: V extends Extract<T[K], V> ? K : never }[keyof T]
>

/**
 * Pick properties from a type that extend from a specific type.
 */

type PickBy<T, V> = Pick<
  T,
  { [K in keyof T]: V extends Extract<T[K], V> ? K : never }[keyof T]
>

/**
 * Simplifies a type definition to its most basic representation.
 */

type Simplify<T> = T extends any[] | Date
  ? T
  : { [Key in keyof T]: T[Key] } & {}
