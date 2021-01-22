import { Struct, Infer, Result, Context, Describe, DescribedResult } from './struct'
import { BasicErrorDetail, Error, ErrorDetail, Failure, StructError } from './error'
import { string } from './structs/types'

/**
 * Check if a value is an iterator.
 */

export function isIterable<T>(x: unknown): x is Iterable<T> {
  return isObject(x) && typeof x[Symbol.iterator] === 'function'
}

/**
 * Check if a value is a plain object.
 */

export function isObject(x: unknown): x is object {
  return typeof x === 'object' && x != null
}

/**
 * Check if a value is a plain object.
 */

export function isPlainObject(x: unknown): x is { [key: string]: any } {
  if (Object.prototype.toString.call(x) !== '[object Object]') {
    return false
  }

  const prototype = Object.getPrototypeOf(x)
  return prototype === null || prototype === Object.prototype
}

/**
 * Return a value as a printable string.
 */

export function print(value: any): string {
  return typeof value === 'string' ? JSON.stringify(value) : `${value}`
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
 * Convert a single validation result to a failure.
 */

export function toFailure<T, S, E extends ErrorDetail>(
  result: DescribedResult<E>,
  context: Context,
  struct: Struct<T, S, any>,
  value: any
): Failure<E> {
  if(!('class' in result)) {
    return result
  }

  let { message } = result;

  const { path, branch } = context
  const { type } = struct

  if (message === undefined) {
    message = `Expected a value of type \`${type}\, but received: \`${print(value)}\``
    result.message = message;
  }

  return {
    value,
    type,
    refinement: undefined,
    key: path[path.length - 1],
    path,
    branch,
    message,
    detail: result,
    failures: [],
  }
}

/**
 * Convert a validation result to an iterable of failures.
 */

export function* toFailures<T, S, E extends ErrorDetail>(
  result: Result<E>,
  context: Context,
  struct: Struct<T, S, E>,
  value: any
): IterableIterator<Failure<E>> {
  if (!isIterable(result)) {
    result = [result]
  }

  for (const r of result) {
    yield toFailure<T,S,E>(r, context, struct, value)
  }
}

/**
 * Check a value against a struct, traversing deeply into nested values, and
 * returning an iterator of failures or success.
 */

export function* run<T, S, E extends Error>(
  value: unknown,
  struct: Struct<T, S, E>,
  options: {
    path?: any[]
    branch?: any[]
    coerce?: boolean
  } = {}
): IterableIterator<[Failure<E>, undefined] | [undefined, T]> {
  const { path = [], branch = [value], coerce = false } = options
  const ctx: Context = { path, branch }

  if (coerce) {
    value = struct.coercer(value, ctx)
  }

  let valid = true

  for (const failure of struct.validator(value, ctx)) {
    valid = false
    yield [failure, undefined]
  }

  for (let [k, v, s] of struct.entries(value, ctx)) {
    const ts = run(v, s as Struct<unknown, unknown, E>, {
      path: k === undefined ? path : [...path, k],
      branch: k === undefined ? branch : [...branch, v],
      coerce,
    })

    for (const t of ts) {
      if (t[0]) {
        valid = false
        yield [t[0], undefined]
      } else if (coerce) {
        v = t[1]

        if (k === undefined) {
          value = v
        } else if (value instanceof Map) {
          value.set(k, v)
        } else if (value instanceof Set) {
          value.add(v)
        } else if (isObject(value)) {
          value[k] = v
        }
      }
    }
  }

  if (valid) {
    for (const failure of struct.refiner(value as T, ctx)) {
      valid = false
      yield [failure, undefined]
    }
  }

  if (valid) {
    yield [undefined, value as T]
  }
}

/**
 * Check if a type is a tuple.
 */

export type IsTuple<T> = T extends [any]
  ? T
  : T extends [any, any]
  ? T
  : T extends [any, any, any]
  ? T
  : T extends [any, any, any, any]
  ? T
  : T extends [any, any, any, any, any]
  ? T
  : never

/**
 * Check if a type is a record type.
 */

export type IsRecord<T> = T extends object
  ? string extends keyof T
    ? T
    : never
  : never

/**
 * Check if a type is a generic string type.
 */

export type IsGenericString<T> = T extends string
  ? string extends T
    ? T
    : never
  : never

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
  : { [K in keyof T]: T[K] } & {}

/**
 * Assign properties from one type to another, overwriting existing.
 */

export type Assign<T, U> = Simplify<U & Omit<T, keyof U>>

/**
 * A schema for object structs.
 */

export type ObjectSchema = Record<string, Struct<any, any, any>>

/**
 * Infer a type from an object struct schema.
 */

export type ObjectType<S extends ObjectSchema> = Simplify<
  Optionalize<{ [K in keyof S]: Infer<S[K]> }>
>

/**
 * Extract error types from an object struct schema.
 */

export type ObjectError<S extends ObjectSchema> = {
  [K in keyof S]: S[K]
} extends Record<any, Struct<any, any, infer E>> ? E : never

/**
 * Transform an object schema type to represent a partial.
 */

export type PartialObjectSchema<S extends ObjectSchema> = {
  [K in keyof S]: Struct<Infer<S[K]> | undefined>
}

/**
 * A schema for any type of struct.
 */

export type StructSchema<T> = [T] extends [string]
  ? [T] extends [IsGenericString<T>]
    ? null
    : EnumSchema<T>
  : T extends
      | number
      | boolean
      | bigint
      | symbol
      | undefined
      | null
      | Function
      | Date
      | Error
      | RegExp
  ? null
  : T extends Map<any, any>
  ? null
  : T extends WeakMap<any, any>
  ? null
  : T extends Set<any>
  ? null
  : T extends WeakSet<any>
  ? null
  : T extends Array<infer E>
  ? T extends IsTuple<T>
    ? null
    : Struct<E>
  : T extends Promise<any>
  ? null
  : T extends object
  ? T extends IsRecord<T>
    ? null
    : { [K in keyof T]: Describe<T[K]> }
  : null

/**
 * A schema for enum structs.
 */

export type EnumSchema<T extends string> = { [K in T]: K }

/**
 * A schema for tuple structs.
 */

export type TupleSchema<T> = { [K in keyof T]: Struct<T[K], unknown, any> }
