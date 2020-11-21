import { Struct, Infer, Result, Context } from './struct'
import { Failure } from './error'

/**
 * Check if a value is a plain object.
 */

export function isPlainObject(value: unknown): value is { [key: string]: any } {
  if (Object.prototype.toString.call(value) !== '[object Object]') {
    return false
  }

  const prototype = Object.getPrototypeOf(value)
  return prototype === null || prototype === Object.prototype
}

/**
 * Return a value as a printable string.
 */

export function print(value: any, ticks?: string): string {
  const string = typeof value === 'string' ? JSON.stringify(value) : `${value}`
  return ticks ? `${ticks}${string}${ticks}` : string
}

/**
 * Shifts (removes and returns) the first value from the `input` iterator.
 * Like `Array.prototype.shift()` but for an `Iterator`.
 */

export function shiftIterator<T>(input: Iterator<T>): T | undefined {
  const { done, value } = input.next()
  return done ? undefined : value
}

/**
 * Convert a validation result to an iterable of failures.
 */

export function* toFailures<T, S>(
  result: Result,
  context: Context<T, S>
): IterableIterator<Failure> {
  if (typeof result === 'string') {
    yield context.fail({ message: result })
  } else if (result === true) {
    return
  } else if (result === false) {
    yield context.fail()
  } else {
    yield* result
  }
}

/**
 * Normalize properties of a type that allow `undefined` to make them optional.
 */

export type Optionalize<S extends object> = OmitBy<S, undefined> &
  Partial<PickBy<S, undefined>>

/**
 * Omit properties from a type that extend from a specific type.
 */

export type OmitBy<T, V> = Omit<
  T,
  { [K in keyof T]: V extends Extract<T[K], V> ? K : never }[keyof T]
>

/**
 * Pick properties from a type that extend from a specific type.
 */

export type PickBy<T, V> = Pick<
  T,
  { [K in keyof T]: V extends Extract<T[K], V> ? K : never }[keyof T]
>

/**
 * Simplifies a type definition to its most basic representation.
 */

export type Simplify<T> = T extends any[] | Date
  ? T
  : { [Key in keyof T]: T[Key] } & {}

/**
 * Assign properties from one type to another, overwriting existing.
 */

export type Assign<T, U> = Simplify<U & Omit<T, keyof U>>

/**
 * A schema for object structs.
 */

export type ObjectSchema = Record<string, Struct<any, any>>

/**
 * Infer a type from an object struct schema.
 */

export type ObjectType<S extends ObjectSchema> = Simplify<
  Optionalize<{ [K in keyof S]: Infer<S[K]> }>
>

/**
 * Transform an object schema type to represent a partial.
 */

export type PartialObjectSchema<S extends ObjectSchema> = {
  [K in keyof S]: Struct<Infer<S[K]> | undefined>
}

/**
 * A schema for tuple structs.
 */

export type TupleSchema<T> = { [K in keyof T]: Struct<T[K]> }
