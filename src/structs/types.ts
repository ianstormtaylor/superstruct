/* eslint-disable no-redeclare */

import { Infer, InferError, Struct } from '../struct'
import { define } from './utilities'
import {
  TupleSchema,
  ObjectSchema,
  ObjectType,
  print,
  run,
  isObject,
  ObjectError,
} from '../utils'
import {
  ValuesErrorDetail,
  Error,
  ErrorDetail,
  TypeErrorDetail,
  ValueErrorDetail,
} from '../error'

/**
 * Ensure that any value passes validation.
 */

export function any(): Struct<any, null, never> {
  return define('any', () => [])
}

/**
 * Ensure that a value is an array and that its elements are of a specific type.
 *
 * Note: If you omit the element struct, the arrays elements will not be
 * iterated at all. This can be helpful for cases where performance is critical,
 * and it is preferred to using `array(any())`.
 */

export function array<T extends Struct<any, any, any>>(
  Element: T
): Struct<Infer<T>[], T, InferError<T> | TypeErrorDetail>
export function array(): Struct<unknown[], undefined, any>
export function array<T>(Element?: Struct<T, unknown, any>): any {
  return new Struct<T, unknown, ErrorDetail>({
    type: 'array',
    schema: Element,
    *entries(value) {
      if (Element && Array.isArray(value)) {
        for (const [i, v] of value.entries()) {
          yield [i, v, Element]
        }
      }
    },
    coercer(value) {
      return Array.isArray(value) ? value.slice() : value
    },
    validator(value) {
      return (
        Array.isArray(value) ||
        ([
          {
            class: 'type',
            except: 'array',
            actually: value,
            message: `Expected an array value, but received: ${print(value)}`,
          },
        ] as TypeErrorDetail[])
      )
    },
  })
}

/**
 * Ensure that a value is a boolean.
 */

export function boolean(): Struct<boolean, null, TypeErrorDetail> {
  return define('boolean', (value) => {
    return (
      typeof value === 'boolean' ||
      ([
        {
          class: 'type',
          except: 'boolean',
          actually: value,
        },
      ] as TypeErrorDetail[])
    )
  })
}

/**
 * Ensure that a value is a valid `Date`.
 *
 * Note: this also ensures that the value is *not* an invalid `Date` object,
 * which can occur when parsing a date fails but still returns a `Date`.
 */

export function date(): Struct<Date, null, TypeErrorDetail> {
  return define('date', (value) => {
    return (
      (value instanceof Date && !isNaN(value.getTime())) ||
      ([
        {
          class: 'type',
          except: 'date',
          actually: value,
        },
      ] as TypeErrorDetail[])
    )
  })
}

/**
 * Ensure that a value is one of a set of potential values.
 *
 * Note: after creating the struct, you can access the definition of the
 * potential values as `struct.schema`.
 */

export function enums<T extends number>(
  values: readonly T[]
): Struct<T, { [K in T[][number]]: K }, ValuesErrorDetail<T>>
export function enums<T extends string>(
  values: readonly T[]
): Struct<T, { [K in T[][number]]: K }, ValuesErrorDetail<T>>
export function enums<T extends number | string>(values: readonly T[]): any {
  const schema: any = {}
  const description = values.map((v) => print(v)).join()

  for (const key of values) {
    schema[key] = key
  }

  return new Struct({
    type: 'enums',
    schema,
    validator(value) {
      return (
        values.includes(value as any) ||
        ([
          {
            class: 'values',
            except: values,
            actually: value,
            message: `Expected one of \`${description}\`, but received: ${print(
              value
            )}`,
          },
        ] as ValuesErrorDetail<T>[])
      )
    },
  })
}

/**
 * Ensure that a value is a function.
 */

export function func(): Struct<Function, null, TypeErrorDetail> {
  return define('func', (value) => {
    return (
      typeof value === 'function' ||
      ([
        {
          class: 'type',
          except: 'funciton',
          actually: value,
          message: `Expected a function, but received: ${print(value)}`,
        },
      ] as TypeErrorDetail[])
    )
  })
}

/**
 * Ensure that a value is an instance of a specific class.
 */

export function instance<T extends { new (...args: any): any }>(
  Class: T
): Struct<InstanceType<T>, null, TypeErrorDetail> {
  return define('instance', (value) => {
    return (
      value instanceof Class || [
        {
          class: 'type',
          varidator: 'instance',
          except: Class.name,
          actually: value,
          message: `Expected a \`${
            Class.name
          }\` instance, but received: ${print(value)}`,
        },
      ]
    )
  })
}

/**
 * Ensure that a value is an integer.
 */

export function integer(): Struct<number, null, TypeErrorDetail> {
  return define('integer', (value) => {
    return (
      (typeof value === 'number' &&
        !isNaN(value) &&
        Number.isInteger(value)) || [
        {
          class: 'type',
          except: 'number',
          actually: value,
          message: `Expected an integer, but received: ${print(value)}`,
        },
      ]
    )
  })
}

/**
 * Ensure that a value matches all of a set of types.
 */

export function intersection<A>(
  Structs: TupleSchema<[A]>
): Struct<A, null, Error> // todo
export function intersection<A, B>(
  Structs: TupleSchema<[A, B]>
): Struct<A & B, null, Error>
export function intersection<A, B, C>(
  Structs: TupleSchema<[A, B, C]>
): Struct<A & B & C, null, Error>
export function intersection<A, B, C, D>(
  Structs: TupleSchema<[A, B, C, D]>
): Struct<A & B & C & D, null, Error>
export function intersection<A, B, C, D, E>(
  Structs: TupleSchema<[A, B, C, D, E]>
): Struct<A & B & C & D & E, null, Error>
export function intersection<A, B, C, D, E, F>(
  Structs: TupleSchema<[A, B, C, D, E, F]>
): Struct<A & B & C & D & E & F, null, Error>
export function intersection<A, B, C, D, E, F, G>(
  Structs: TupleSchema<[A, B, C, D, E, F, G]>
): Struct<A & B & C & D & E & F & G, null, Error>
export function intersection<A, B, C, D, E, F, G, H>(
  Structs: TupleSchema<[A, B, C, D, E, F, G, H]>
): Struct<A & B & C & D & E & F & G & H, null, Error>
export function intersection<A, B, C, D, E, F, G, H, I>(
  Structs: TupleSchema<[A, B, C, D, E, F, G, H, I]>
): Struct<A & B & C & D & E & F & G & H & I, null, Error>
export function intersection<A, B, C, D, E, F, G, H, I, J>(
  Structs: TupleSchema<[A, B, C, D, E, F, G, H, I, J]>
): Struct<A & B & C & D & E & F & G & H & I & J, null, Error>
export function intersection<A, B, C, D, E, F, G, H, I, J, K>(
  Structs: TupleSchema<[A, B, C, D, E, F, G, H, I, J, K]>
): Struct<A & B & C & D & E & F & G & H & I & J & K, null, Error>
export function intersection<A, B, C, D, E, F, G, H, I, J, K, L>(
  Structs: TupleSchema<[A, B, C, D, E, F, G, H, I, J, K, L]>
): Struct<A & B & C & D & E & F & G & H & I & J & K & L, null, Error>
export function intersection<A, B, C, D, E, F, G, H, I, J, K, L, M>(
  Structs: TupleSchema<[A, B, C, D, E, F, G, H, I, J, K, L, M]>
): Struct<A & B & C & D & E & F & G & H & I & J & K & L & M, null, Error>
export function intersection<A, B, C, D, E, F, G, H, I, J, K, L, M, N>(
  Structs: TupleSchema<[A, B, C, D, E, F, G, H, I, J, K, L, M, N]>
): Struct<A & B & C & D & E & F & G & H & I & J & K & L & M & N, null, Error>
export function intersection<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O>(
  Structs: TupleSchema<[A, B, C, D, E, F, G, H, I, J, K, L, M, N, O]>
): Struct<
  A & B & C & D & E & F & G & H & I & J & K & L & M & N & O,
  null,
  Error
>
export function intersection<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P>(
  Structs: TupleSchema<[A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P]>
): Struct<
  A & B & C & D & E & F & G & H & I & J & K & L & M & N & O & P,
  null,
  Error
>
export function intersection<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q>(
  Structs: TupleSchema<[A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q]>
): Struct<
  A & B & C & D & E & F & G & H & I & J & K & L & M & N & O & P & Q,
  null,
  Error
>
export function intersection(Structs: Array<Struct<any, any, Error>>): any {
  return new Struct({
    type: 'intersection',
    schema: null,
    *entries(value, ctx) {
      for (const S of Structs) {
        yield* S.entries(value, ctx)
      }
    },
    *validator(value, ctx) {
      for (const S of Structs) {
        yield* S.validator(value, ctx)
      }
    },
    *refiner(value, ctx) {
      for (const S of Structs) {
        yield* S.refiner(value, ctx)
      }
    },
  })
}

/**
 * Ensure that a value is an exact value, using `===` for comparison.
 */

export function literal<T extends boolean>(
  constant: T
): Struct<T, null, ValueErrorDetail<T>>
export function literal<T extends number>(
  constant: T
): Struct<T, null, ValueErrorDetail<T>>
export function literal<T extends string>(
  constant: T
): Struct<T, null, ValueErrorDetail<T>>
export function literal<T>(constant: T): Struct<T, null, ValueErrorDetail<T>>
export function literal<T>(constant: T): any {
  const description = print(constant)
  return define('literal', (value) => {
    return (
      value === constant ||
      ([
        {
          class: 'value',
          except: constant,
          actually: value,
          message: `Expected the literal \`${description}\`, but received: ${print(
            value
          )}`,
        },
      ] as ValueErrorDetail<T>[])
    )
  })
}

/**
 * Ensure that a value is a `Map` object, and that its keys and values are of
 * specific types.
 */

export function map(): Struct<Map<unknown, unknown>, null, TypeErrorDetail>
export function map<K, V, KE extends Error, VE extends Error>(
  Key: Struct<K, unknown, KE>,
  Value: Struct<V, unknown, VE>
): Struct<Map<K, V>, null, TypeErrorDetail | KE | VE>
export function map<K, V>(
  Key?: Struct<K, unknown, any>,
  Value?: Struct<V, unknown, any>
): any {
  return new Struct({
    type: 'map',
    schema: null,
    *entries(value) {
      if (Key && Value && value instanceof Map) {
        for (const [k, v] of value.entries()) {
          yield [k as string, k, Key]
          yield [k as string, v, Value]
        }
      }
    },
    coercer(value) {
      return value instanceof Map ? new Map(value) : value
    },
    validator(value) {
      return (
        value instanceof Map ||
        ([
          {
            class: 'type',
            except: 'Map',
            actually: value,
            message: `Expected a \`Map\` object, but received: ${print(value)}`,
          },
        ] as TypeErrorDetail[])
      )
    },
  })
}

/**
 * Ensure that no value ever passes validation.
 */

export function never(): Struct<never, null, TypeErrorDetail> {
  return define('never', (value) =>
    [
      {
        class: 'type',
        except: 'never',
        actually: value,
      },
    ] as TypeErrorDetail[])
}

/**
 * Augment an existing struct to allow `null` values.
 */

export function nullable<T, S, E extends ErrorDetail>(
  struct: Struct<T, S, E>
): Struct<T | null, S, E> {
  return new Struct({
    ...struct,
    validator: (value, ctx) =>
      value === null ? [] : struct.validator(value, ctx),
    refiner: (value, ctx) => (value === null ? [] : struct.refiner(value, ctx)),
  })
}

/**
 * Ensure that a value is a number.
 */

export function number(): Struct<number, null, TypeErrorDetail> {
  return define('number', (value) => {
    return (
      (typeof value === 'number' && !isNaN(value)) ||
      ([
        {
          class: 'type',
          except: 'number',
          actually: value,
          message: `Expected a number, but received: ${print(value)}`,
        },
      ] as TypeErrorDetail[])
    )
  })
}

/**
 * Ensure that a value is an object, that is has a known set of properties,
 * and that its properties are of specific types.
 *
 * Note: Unrecognized properties will fail validation.
 */

export function object(): Struct<Record<string, unknown>, null, Error>
export function object<S extends ObjectSchema>(
  schema: S
): Struct<ObjectType<S>, S, ObjectError<S> | TypeErrorDetail>
export function object<S extends ObjectSchema>(schema?: S): any {
  const knowns = schema ? Object.keys(schema) : []
  const Never = never()
  return new Struct<ObjectType<S>, S | null, ObjectError<S> | TypeErrorDetail>({
    type: 'object',
    schema: schema ? schema : null,
    *entries(value) {
      if (schema && isObject(value)) {
        const unknowns = new Set(Object.keys(value))

        for (const key of knowns) {
          unknowns.delete(key)
          yield [key, value[key], schema[key]]
        }

        for (const key of unknowns) {
          yield [key, value[key], Never]
        }
      }
    },
    validator(value) {
      return (
        isObject(value) ||
        ([
          {
            class: 'type',
            except: 'object',
            actually: value,
            message: `Expected an object, but received: ${print(value)}`,
          },
        ] as TypeErrorDetail[])
      )
    },
    coercer(value) {
      return isObject(value) ? { ...value } : value
    },
  })
}

/**
 * Augment a struct to allow `undefined` values.
 */

export function optional<T, S, E extends Error>(
  struct: Struct<T, S, E>
): Struct<T | undefined, S, E> {
  return new Struct({
    ...struct,
    validator: (value, ctx) =>
      value === undefined ? [] : struct.validator(value, ctx),
    refiner: (value, ctx) =>
      value === undefined ? [] : struct.refiner(value, ctx),
  })
}

/**
 * Ensure that a value is an object with keys and values of specific types, but
 * without ensuring any specific shape of properties.
 *
 * Like TypeScript's `Record` utility.
 */

export function record<K extends string, V, KE extends Error, VE extends Error>(
  Key: Struct<K, unknown, KE>,
  Value: Struct<V, unknown, VE>
): Struct<Record<K, V>, null, KE | VE | TypeErrorDetail> {
  return new Struct<Record<K, V>, null, KE | VE | TypeErrorDetail>({
    type: 'record',
    schema: null,
    *entries(value) {
      if (isObject(value)) {
        for (const k in value) {
          const v = value[k]
          yield [k, k, Key]
          yield [k, v, Value]
        }
      }
    },
    validator(value) {
      return (
        isObject(value) ||
        ([
          {
            class: 'type',
            except: 'object',
            actually: value,
            message: `Expected an object, but received: ${print(value)}`,
          },
        ] as TypeErrorDetail[])
      )
    },
  })
}

/**
 * Ensure that a value is a `RegExp`.
 *
 * Note: this does not test the value against the regular expression! For that
 * you need to use the `pattern()` refinement.
 */

export function regexp(): Struct<RegExp, null, TypeErrorDetail> {
  return define('regexp', (value) => {
    return (
      value instanceof RegExp ||
      ([
        {
          class: 'type',
          except: 'regexp',
          actually: value,
        },
      ] as TypeErrorDetail[])
    )
  })
}

/**
 * Ensure that a value is a `Set` object, and that its elements are of a
 * specific type.
 */

export function set(): Struct<Set<unknown>, null, Error>
export function set<T, E extends ErrorDetail>(
  Element: Struct<T, unknown, E>
): Struct<Set<T>, null, E | TypeErrorDetail>
export function set<T, E extends ErrorDetail>(
  Element?: Struct<T, unknown, E>
): any {
  return new Struct<T, unknown, E | TypeErrorDetail>({
    type: 'set',
    schema: null,
    *entries(value) {
      if (Element && value instanceof Set) {
        for (const v of value) {
          yield [v as string, v, Element]
        }
      }
    },
    coercer(value) {
      return value instanceof Set ? new Set(value) : value
    },
    validator(value) {
      return (
        value instanceof Set ||
        ([
          {
            class: 'type',
            except: 'Set',
            actually: value,
            message: `Expected a \`Set\` object, but received: ${print(value)}`,
          },
        ] as TypeErrorDetail[])
      )
    },
  })
}

/**
 * Ensure that a value is a string.
 */

export function string(): Struct<string, null, TypeErrorDetail> {
  return define('string', (value) => {
    return (
      typeof value === 'string' ||
      ([
        {
          class: 'type',
          except: 'string',
          actually: value,
          message: `Expected a string, but received: ${print(value)}`,
        },
      ] as TypeErrorDetail[])
    )
  })
}

/**
 * Ensure that a value is a tuple of a specific length, and that each of its
 * elements is of a specific type.
 */ export function tuple<A extends Struct<any, any, Error>>(
  Structs: [A]
): Struct<[Infer<A>], null, InferError<A>>
export function tuple<
  A extends Struct<any, any, Error>,
  B extends Struct<any, any, Error>
>(
  Structs: [A, B]
): Struct<[Infer<A>, Infer<B>], null, InferError<A> | InferError<B>>
export function tuple<
  A extends Struct<any, any, Error>,
  B extends Struct<any, any, Error>,
  C extends Struct<any, any, Error>
>(
  Structs: [A, B, C]
): Struct<
  [Infer<A>, Infer<B>, Infer<C>],
  null,
  InferError<A> | InferError<B> | InferError<C>
>
export function tuple<
  A extends Struct<any, any, Error>,
  B extends Struct<any, any, Error>,
  C extends Struct<any, any, Error>,
  D extends Struct<any, any, Error>
>(
  Structs: [A, B, C, D]
): Struct<
  [Infer<A>, Infer<B>, Infer<C>, Infer<D>],
  null,
  InferError<A> | InferError<B> | InferError<C> | InferError<D>
>
export function tuple<
  A extends Struct<any, any, Error>,
  B extends Struct<any, any, Error>,
  C extends Struct<any, any, Error>,
  D extends Struct<any, any, Error>,
  E extends Struct<any, any, Error>
>(
  Structs: [A, B, C, D, E]
): Struct<
  [Infer<A>, Infer<B>, Infer<C>, Infer<D>, Infer<E>],
  null,
  InferError<A> | InferError<B> | InferError<C> | InferError<D> | InferError<E>
>
export function tuple<
  A extends Struct<any, any, Error>,
  B extends Struct<any, any, Error>,
  C extends Struct<any, any, Error>,
  D extends Struct<any, any, Error>,
  E extends Struct<any, any, Error>,
  F extends Struct<any, any, Error>
>(
  Structs: [A, B, C, D, E, F]
): Struct<
  [Infer<A>, Infer<B>, Infer<C>, Infer<D>, Infer<E>, Infer<F>],
  null,
  | InferError<A>
  | InferError<B>
  | InferError<C>
  | InferError<D>
  | InferError<E>
  | InferError<F>
>
export function tuple<
  A extends Struct<any, any, Error>,
  B extends Struct<any, any, Error>,
  C extends Struct<any, any, Error>,
  D extends Struct<any, any, Error>,
  E extends Struct<any, any, Error>,
  F extends Struct<any, any, Error>,
  G extends Struct<any, any, Error>
>(
  Structs: [A, B, C, D, E, F, G]
): Struct<
  [Infer<A>, Infer<B>, Infer<C>, Infer<D>, Infer<E>, Infer<F>, Infer<G>],
  null,
  | InferError<A>
  | InferError<B>
  | InferError<C>
  | InferError<D>
  | InferError<E>
  | InferError<F>
  | InferError<G>
>
export function tuple<
  A extends Struct<any, any, Error>,
  B extends Struct<any, any, Error>,
  C extends Struct<any, any, Error>,
  D extends Struct<any, any, Error>,
  E extends Struct<any, any, Error>,
  F extends Struct<any, any, Error>,
  G extends Struct<any, any, Error>,
  H extends Struct<any, any, Error>
>(
  Structs: [A, B, C, D, E, F, G, H]
): Struct<
  [
    Infer<A>,
    Infer<B>,
    Infer<C>,
    Infer<D>,
    Infer<E>,
    Infer<F>,
    Infer<G>,
    Infer<H>
  ],
  null,
  | InferError<A>
  | InferError<B>
  | InferError<C>
  | InferError<D>
  | InferError<E>
  | InferError<F>
  | InferError<G>
  | InferError<H>
>
export function tuple<
  A extends Struct<any, any, Error>,
  B extends Struct<any, any, Error>,
  C extends Struct<any, any, Error>,
  D extends Struct<any, any, Error>,
  E extends Struct<any, any, Error>,
  F extends Struct<any, any, Error>,
  G extends Struct<any, any, Error>,
  H extends Struct<any, any, Error>,
  I extends Struct<any, any, Error>
>(
  Structs: [A, B, C, D, E, F, G, H, I]
): Struct<
  [
    Infer<A>,
    Infer<B>,
    Infer<C>,
    Infer<D>,
    Infer<E>,
    Infer<F>,
    Infer<G>,
    Infer<H>,
    Infer<I>
  ],
  null,
  | InferError<A>
  | InferError<B>
  | InferError<C>
  | InferError<D>
  | InferError<E>
  | InferError<F>
  | InferError<G>
  | InferError<H>
  | InferError<I>
>
export function tuple<
  A extends Struct<any, any, Error>,
  B extends Struct<any, any, Error>,
  C extends Struct<any, any, Error>,
  D extends Struct<any, any, Error>,
  E extends Struct<any, any, Error>,
  F extends Struct<any, any, Error>,
  G extends Struct<any, any, Error>,
  H extends Struct<any, any, Error>,
  I extends Struct<any, any, Error>,
  J extends Struct<any, any, Error>
>(
  Structs: [A, B, C, D, E, F, G, H, I, J]
): Struct<
  [
    Infer<A>,
    Infer<B>,
    Infer<C>,
    Infer<D>,
    Infer<E>,
    Infer<F>,
    Infer<G>,
    Infer<H>,
    Infer<I>,
    Infer<J>
  ],
  null,
  | InferError<A>
  | InferError<B>
  | InferError<C>
  | InferError<D>
  | InferError<E>
  | InferError<F>
  | InferError<G>
  | InferError<H>
  | InferError<I>
  | InferError<J>
>
export function tuple<
  A extends Struct<any, any, Error>,
  B extends Struct<any, any, Error>,
  C extends Struct<any, any, Error>,
  D extends Struct<any, any, Error>,
  E extends Struct<any, any, Error>,
  F extends Struct<any, any, Error>,
  G extends Struct<any, any, Error>,
  H extends Struct<any, any, Error>,
  I extends Struct<any, any, Error>,
  J extends Struct<any, any, Error>,
  K extends Struct<any, any, Error>
>(
  Structs: [A, B, C, D, E, F, G, H, I, J, K]
): Struct<
  [
    Infer<A>,
    Infer<B>,
    Infer<C>,
    Infer<D>,
    Infer<E>,
    Infer<F>,
    Infer<G>,
    Infer<H>,
    Infer<I>,
    Infer<J>,
    Infer<K>
  ],
  null,
  | InferError<A>
  | InferError<B>
  | InferError<C>
  | InferError<D>
  | InferError<E>
  | InferError<F>
  | InferError<G>
  | InferError<H>
  | InferError<I>
  | InferError<J>
  | InferError<K>
>
export function tuple<
  A extends Struct<any, any, Error>,
  B extends Struct<any, any, Error>,
  C extends Struct<any, any, Error>,
  D extends Struct<any, any, Error>,
  E extends Struct<any, any, Error>,
  F extends Struct<any, any, Error>,
  G extends Struct<any, any, Error>,
  H extends Struct<any, any, Error>,
  I extends Struct<any, any, Error>,
  J extends Struct<any, any, Error>,
  K extends Struct<any, any, Error>,
  L extends Struct<any, any, Error>
>(
  Structs: [A, B, C, D, E, F, G, H, I, J, K, L]
): Struct<
  [
    Infer<A>,
    Infer<B>,
    Infer<C>,
    Infer<D>,
    Infer<E>,
    Infer<F>,
    Infer<G>,
    Infer<H>,
    Infer<I>,
    Infer<J>,
    Infer<K>,
    Infer<L>
  ],
  null,
  | InferError<A>
  | InferError<B>
  | InferError<C>
  | InferError<D>
  | InferError<E>
  | InferError<F>
  | InferError<G>
  | InferError<H>
  | InferError<I>
  | InferError<J>
  | InferError<K>
  | InferError<L>
>
export function tuple<
  A extends Struct<any, any, Error>,
  B extends Struct<any, any, Error>,
  C extends Struct<any, any, Error>,
  D extends Struct<any, any, Error>,
  E extends Struct<any, any, Error>,
  F extends Struct<any, any, Error>,
  G extends Struct<any, any, Error>,
  H extends Struct<any, any, Error>,
  I extends Struct<any, any, Error>,
  J extends Struct<any, any, Error>,
  K extends Struct<any, any, Error>,
  L extends Struct<any, any, Error>,
  M extends Struct<any, any, Error>
>(
  Structs: [A, B, C, D, E, F, G, H, I, J, K, L, M]
): Struct<
  [
    Infer<A>,
    Infer<B>,
    Infer<C>,
    Infer<D>,
    Infer<E>,
    Infer<F>,
    Infer<G>,
    Infer<H>,
    Infer<I>,
    Infer<J>,
    Infer<K>,
    Infer<L>,
    Infer<M>
  ],
  null,
  | InferError<A>
  | InferError<B>
  | InferError<C>
  | InferError<D>
  | InferError<E>
  | InferError<F>
  | InferError<G>
  | InferError<H>
  | InferError<I>
  | InferError<J>
  | InferError<K>
  | InferError<L>
  | InferError<M>
>
export function tuple<
  A extends Struct<any, any, Error>,
  B extends Struct<any, any, Error>,
  C extends Struct<any, any, Error>,
  D extends Struct<any, any, Error>,
  E extends Struct<any, any, Error>,
  F extends Struct<any, any, Error>,
  G extends Struct<any, any, Error>,
  H extends Struct<any, any, Error>,
  I extends Struct<any, any, Error>,
  J extends Struct<any, any, Error>,
  K extends Struct<any, any, Error>,
  L extends Struct<any, any, Error>,
  M extends Struct<any, any, Error>,
  N extends Struct<any, any, Error>
>(
  Structs: [A, B, C, D, E, F, G, H, I, J, K, L, M, N]
): Struct<
  [
    Infer<A>,
    Infer<B>,
    Infer<C>,
    Infer<D>,
    Infer<E>,
    Infer<F>,
    Infer<G>,
    Infer<H>,
    Infer<I>,
    Infer<J>,
    Infer<K>,
    Infer<L>,
    Infer<M>,
    Infer<N>
  ],
  null,
  | InferError<A>
  | InferError<B>
  | InferError<C>
  | InferError<D>
  | InferError<E>
  | InferError<F>
  | InferError<G>
  | InferError<H>
  | InferError<I>
  | InferError<J>
  | InferError<K>
  | InferError<L>
  | InferError<M>
  | InferError<N>
>
export function tuple<
  A extends Struct<any, any, Error>,
  B extends Struct<any, any, Error>,
  C extends Struct<any, any, Error>,
  D extends Struct<any, any, Error>,
  E extends Struct<any, any, Error>,
  F extends Struct<any, any, Error>,
  G extends Struct<any, any, Error>,
  H extends Struct<any, any, Error>,
  I extends Struct<any, any, Error>,
  J extends Struct<any, any, Error>,
  K extends Struct<any, any, Error>,
  L extends Struct<any, any, Error>,
  M extends Struct<any, any, Error>,
  N extends Struct<any, any, Error>,
  O extends Struct<any, any, Error>
>(
  Structs: [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O]
): Struct<
  [
    Infer<A>,
    Infer<B>,
    Infer<C>,
    Infer<D>,
    Infer<E>,
    Infer<F>,
    Infer<G>,
    Infer<H>,
    Infer<I>,
    Infer<J>,
    Infer<K>,
    Infer<L>,
    Infer<M>,
    Infer<N>,
    Infer<O>
  ],
  null,
  | InferError<A>
  | InferError<B>
  | InferError<C>
  | InferError<D>
  | InferError<E>
  | InferError<F>
  | InferError<G>
  | InferError<H>
  | InferError<I>
  | InferError<J>
  | InferError<K>
  | InferError<L>
  | InferError<M>
  | InferError<N>
  | InferError<O>
>
export function tuple<
  A extends Struct<any, any, Error>,
  B extends Struct<any, any, Error>,
  C extends Struct<any, any, Error>,
  D extends Struct<any, any, Error>,
  E extends Struct<any, any, Error>,
  F extends Struct<any, any, Error>,
  G extends Struct<any, any, Error>,
  H extends Struct<any, any, Error>,
  I extends Struct<any, any, Error>,
  J extends Struct<any, any, Error>,
  K extends Struct<any, any, Error>,
  L extends Struct<any, any, Error>,
  M extends Struct<any, any, Error>,
  N extends Struct<any, any, Error>,
  O extends Struct<any, any, Error>,
  P extends Struct<any, any, Error>
>(
  Structs: [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P]
): Struct<
  [
    Infer<A>,
    Infer<B>,
    Infer<C>,
    Infer<D>,
    Infer<E>,
    Infer<F>,
    Infer<G>,
    Infer<H>,
    Infer<I>,
    Infer<J>,
    Infer<K>,
    Infer<L>,
    Infer<M>,
    Infer<N>,
    Infer<O>,
    Infer<P>
  ],
  null,
  | InferError<A>
  | InferError<B>
  | InferError<C>
  | InferError<D>
  | InferError<E>
  | InferError<F>
  | InferError<G>
  | InferError<H>
  | InferError<I>
  | InferError<J>
  | InferError<K>
  | InferError<L>
  | InferError<M>
  | InferError<N>
  | InferError<O>
  | InferError<P>
>
export function tuple<
  A extends Struct<any, any, Error>,
  B extends Struct<any, any, Error>,
  C extends Struct<any, any, Error>,
  D extends Struct<any, any, Error>,
  E extends Struct<any, any, Error>,
  F extends Struct<any, any, Error>,
  G extends Struct<any, any, Error>,
  H extends Struct<any, any, Error>,
  I extends Struct<any, any, Error>,
  J extends Struct<any, any, Error>,
  K extends Struct<any, any, Error>,
  L extends Struct<any, any, Error>,
  M extends Struct<any, any, Error>,
  N extends Struct<any, any, Error>,
  O extends Struct<any, any, Error>,
  P extends Struct<any, any, Error>,
  Q extends Struct<any, any, Error>
>(
  Structs: [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q]
): Struct<
  [
    Infer<A>,
    Infer<B>,
    Infer<C>,
    Infer<D>,
    Infer<E>,
    Infer<F>,
    Infer<G>,
    Infer<H>,
    Infer<I>,
    Infer<J>,
    Infer<K>,
    Infer<L>,
    Infer<M>,
    Infer<N>,
    Infer<O>,
    Infer<P>,
    Infer<Q>
  ],
  null,
  | InferError<A>
  | InferError<B>
  | InferError<C>
  | InferError<D>
  | InferError<E>
  | InferError<F>
  | InferError<G>
  | InferError<H>
  | InferError<I>
  | InferError<J>
  | InferError<K>
  | InferError<L>
  | InferError<M>
  | InferError<N>
  | InferError<O>
  | InferError<P>
  | InferError<Q>
>
/*
// generate script
var keys = 'A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q'.split(',').map(s=>s.trim());
keys.map((v,i) => {
  const types = keys.slice(0, i+1);
  return `export function tuple<${types.map(t => `${t} extends Struct<any,any,Error>`).join(', ')}>(
  Structs: [${types.join(', ')}]
): Struct<[${types.map(t => `Infer<${t}>`).join(', ')}], null, ${types.map(t => `InferError<${t}>`).join(' | ')}>`;
}).join('\n')
*/
export function tuple(Elements: Struct<any, any, any>[]): any {
  const Never = never()

  return new Struct({
    type: 'tuple',
    schema: null,
    *entries(value) {
      if (Array.isArray(value)) {
        const length = Math.max(Elements.length, value.length)

        for (let i = 0; i < length; i++) {
          yield [i, value[i], Elements[i] || Never]
        }
      }
    },
    validator(value) {
      return (
        Array.isArray(value) ||
        ([
          {
            class: 'type',
            except: 'array',
            actually: value,
            message: `Expected an array, but received: ${print(value)}`,
          },
        ] as TypeErrorDetail[])
      )
    },
  })
}

/**
 * Ensure that a value has a set of known properties of specific types.
 *
 * Note: Unrecognized properties are allowed and untouched. This is similar to
 * how TypeScript's structural typing works.
 */

export function type<S extends ObjectSchema>(
  schema: S
): Struct<ObjectType<S>, S, ObjectError<S> | TypeErrorDetail> {
  const keys = Object.keys(schema)
  return new Struct({
    type: 'type',
    schema,
    *entries(value) {
      if (isObject(value)) {
        for (const k of keys) {
          yield [k, value[k], schema[k]]
        }
      }
    },
    validator(value) {
      return (
        isObject(value) ||
        ([
          {
            class: 'type',
            except: 'object',
            actually: value,
            message: `Expected an object, but received: ${print(value)}`,
          },
        ] as TypeErrorDetail[])
      )
    },
  })
}

/**
 * Ensure that a value matches one of a set of types.
 */
export function union<A extends Struct<any, any, Error>>(
  Structs: [A]
): Struct<Infer<A>, null, InferError<A>>
export function union<
  A extends Struct<any, any, Error>,
  B extends Struct<any, any, Error>
>(
  Structs: [A, B]
): Struct<Infer<A> | Infer<B>, null, InferError<A> | InferError<B>>
export function union<
  A extends Struct<any, any, Error>,
  B extends Struct<any, any, Error>,
  C extends Struct<any, any, Error>
>(
  Structs: [A, B, C]
): Struct<
  Infer<A> | Infer<B> | Infer<C>,
  null,
  InferError<A> | InferError<B> | InferError<C>
>
export function union<
  A extends Struct<any, any, Error>,
  B extends Struct<any, any, Error>,
  C extends Struct<any, any, Error>,
  D extends Struct<any, any, Error>
>(
  Structs: [A, B, C, D]
): Struct<
  Infer<A> | Infer<B> | Infer<C> | Infer<D>,
  null,
  InferError<A> | InferError<B> | InferError<C> | InferError<D>
>
export function union<
  A extends Struct<any, any, Error>,
  B extends Struct<any, any, Error>,
  C extends Struct<any, any, Error>,
  D extends Struct<any, any, Error>,
  E extends Struct<any, any, Error>
>(
  Structs: [A, B, C, D, E]
): Struct<
  Infer<A> | Infer<B> | Infer<C> | Infer<D> | Infer<E>,
  null,
  InferError<A> | InferError<B> | InferError<C> | InferError<D> | InferError<E>
>
export function union<
  A extends Struct<any, any, Error>,
  B extends Struct<any, any, Error>,
  C extends Struct<any, any, Error>,
  D extends Struct<any, any, Error>,
  E extends Struct<any, any, Error>,
  F extends Struct<any, any, Error>
>(
  Structs: [A, B, C, D, E, F]
): Struct<
  Infer<A> | Infer<B> | Infer<C> | Infer<D> | Infer<E> | Infer<F>,
  null,
  | InferError<A>
  | InferError<B>
  | InferError<C>
  | InferError<D>
  | InferError<E>
  | InferError<F>
>
export function union<
  A extends Struct<any, any, Error>,
  B extends Struct<any, any, Error>,
  C extends Struct<any, any, Error>,
  D extends Struct<any, any, Error>,
  E extends Struct<any, any, Error>,
  F extends Struct<any, any, Error>,
  G extends Struct<any, any, Error>
>(
  Structs: [A, B, C, D, E, F, G]
): Struct<
  Infer<A> | Infer<B> | Infer<C> | Infer<D> | Infer<E> | Infer<F> | Infer<G>,
  null,
  | InferError<A>
  | InferError<B>
  | InferError<C>
  | InferError<D>
  | InferError<E>
  | InferError<F>
  | InferError<G>
>
export function union<
  A extends Struct<any, any, Error>,
  B extends Struct<any, any, Error>,
  C extends Struct<any, any, Error>,
  D extends Struct<any, any, Error>,
  E extends Struct<any, any, Error>,
  F extends Struct<any, any, Error>,
  G extends Struct<any, any, Error>,
  H extends Struct<any, any, Error>
>(
  Structs: [A, B, C, D, E, F, G, H]
): Struct<
  | Infer<A>
  | Infer<B>
  | Infer<C>
  | Infer<D>
  | Infer<E>
  | Infer<F>
  | Infer<G>
  | Infer<H>,
  null,
  | InferError<A>
  | InferError<B>
  | InferError<C>
  | InferError<D>
  | InferError<E>
  | InferError<F>
  | InferError<G>
  | InferError<H>
>
export function union<
  A extends Struct<any, any, Error>,
  B extends Struct<any, any, Error>,
  C extends Struct<any, any, Error>,
  D extends Struct<any, any, Error>,
  E extends Struct<any, any, Error>,
  F extends Struct<any, any, Error>,
  G extends Struct<any, any, Error>,
  H extends Struct<any, any, Error>,
  I extends Struct<any, any, Error>
>(
  Structs: [A, B, C, D, E, F, G, H, I]
): Struct<
  | Infer<A>
  | Infer<B>
  | Infer<C>
  | Infer<D>
  | Infer<E>
  | Infer<F>
  | Infer<G>
  | Infer<H>
  | Infer<I>,
  null,
  | InferError<A>
  | InferError<B>
  | InferError<C>
  | InferError<D>
  | InferError<E>
  | InferError<F>
  | InferError<G>
  | InferError<H>
  | InferError<I>
>
export function union<
  A extends Struct<any, any, Error>,
  B extends Struct<any, any, Error>,
  C extends Struct<any, any, Error>,
  D extends Struct<any, any, Error>,
  E extends Struct<any, any, Error>,
  F extends Struct<any, any, Error>,
  G extends Struct<any, any, Error>,
  H extends Struct<any, any, Error>,
  I extends Struct<any, any, Error>,
  J extends Struct<any, any, Error>
>(
  Structs: [A, B, C, D, E, F, G, H, I, J]
): Struct<
  | Infer<A>
  | Infer<B>
  | Infer<C>
  | Infer<D>
  | Infer<E>
  | Infer<F>
  | Infer<G>
  | Infer<H>
  | Infer<I>
  | Infer<J>,
  null,
  | InferError<A>
  | InferError<B>
  | InferError<C>
  | InferError<D>
  | InferError<E>
  | InferError<F>
  | InferError<G>
  | InferError<H>
  | InferError<I>
  | InferError<J>
>
export function union<
  A extends Struct<any, any, Error>,
  B extends Struct<any, any, Error>,
  C extends Struct<any, any, Error>,
  D extends Struct<any, any, Error>,
  E extends Struct<any, any, Error>,
  F extends Struct<any, any, Error>,
  G extends Struct<any, any, Error>,
  H extends Struct<any, any, Error>,
  I extends Struct<any, any, Error>,
  J extends Struct<any, any, Error>,
  K extends Struct<any, any, Error>
>(
  Structs: [A, B, C, D, E, F, G, H, I, J, K]
): Struct<
  | Infer<A>
  | Infer<B>
  | Infer<C>
  | Infer<D>
  | Infer<E>
  | Infer<F>
  | Infer<G>
  | Infer<H>
  | Infer<I>
  | Infer<J>
  | Infer<K>,
  null,
  | InferError<A>
  | InferError<B>
  | InferError<C>
  | InferError<D>
  | InferError<E>
  | InferError<F>
  | InferError<G>
  | InferError<H>
  | InferError<I>
  | InferError<J>
  | InferError<K>
>
export function union<
  A extends Struct<any, any, Error>,
  B extends Struct<any, any, Error>,
  C extends Struct<any, any, Error>,
  D extends Struct<any, any, Error>,
  E extends Struct<any, any, Error>,
  F extends Struct<any, any, Error>,
  G extends Struct<any, any, Error>,
  H extends Struct<any, any, Error>,
  I extends Struct<any, any, Error>,
  J extends Struct<any, any, Error>,
  K extends Struct<any, any, Error>,
  L extends Struct<any, any, Error>
>(
  Structs: [A, B, C, D, E, F, G, H, I, J, K, L]
): Struct<
  | Infer<A>
  | Infer<B>
  | Infer<C>
  | Infer<D>
  | Infer<E>
  | Infer<F>
  | Infer<G>
  | Infer<H>
  | Infer<I>
  | Infer<J>
  | Infer<K>
  | Infer<L>,
  null,
  | InferError<A>
  | InferError<B>
  | InferError<C>
  | InferError<D>
  | InferError<E>
  | InferError<F>
  | InferError<G>
  | InferError<H>
  | InferError<I>
  | InferError<J>
  | InferError<K>
  | InferError<L>
>
export function union<
  A extends Struct<any, any, Error>,
  B extends Struct<any, any, Error>,
  C extends Struct<any, any, Error>,
  D extends Struct<any, any, Error>,
  E extends Struct<any, any, Error>,
  F extends Struct<any, any, Error>,
  G extends Struct<any, any, Error>,
  H extends Struct<any, any, Error>,
  I extends Struct<any, any, Error>,
  J extends Struct<any, any, Error>,
  K extends Struct<any, any, Error>,
  L extends Struct<any, any, Error>,
  M extends Struct<any, any, Error>
>(
  Structs: [A, B, C, D, E, F, G, H, I, J, K, L, M]
): Struct<
  | Infer<A>
  | Infer<B>
  | Infer<C>
  | Infer<D>
  | Infer<E>
  | Infer<F>
  | Infer<G>
  | Infer<H>
  | Infer<I>
  | Infer<J>
  | Infer<K>
  | Infer<L>
  | Infer<M>,
  null,
  | InferError<A>
  | InferError<B>
  | InferError<C>
  | InferError<D>
  | InferError<E>
  | InferError<F>
  | InferError<G>
  | InferError<H>
  | InferError<I>
  | InferError<J>
  | InferError<K>
  | InferError<L>
  | InferError<M>
>
export function union<
  A extends Struct<any, any, Error>,
  B extends Struct<any, any, Error>,
  C extends Struct<any, any, Error>,
  D extends Struct<any, any, Error>,
  E extends Struct<any, any, Error>,
  F extends Struct<any, any, Error>,
  G extends Struct<any, any, Error>,
  H extends Struct<any, any, Error>,
  I extends Struct<any, any, Error>,
  J extends Struct<any, any, Error>,
  K extends Struct<any, any, Error>,
  L extends Struct<any, any, Error>,
  M extends Struct<any, any, Error>,
  N extends Struct<any, any, Error>
>(
  Structs: [A, B, C, D, E, F, G, H, I, J, K, L, M, N]
): Struct<
  | Infer<A>
  | Infer<B>
  | Infer<C>
  | Infer<D>
  | Infer<E>
  | Infer<F>
  | Infer<G>
  | Infer<H>
  | Infer<I>
  | Infer<J>
  | Infer<K>
  | Infer<L>
  | Infer<M>
  | Infer<N>,
  null,
  | InferError<A>
  | InferError<B>
  | InferError<C>
  | InferError<D>
  | InferError<E>
  | InferError<F>
  | InferError<G>
  | InferError<H>
  | InferError<I>
  | InferError<J>
  | InferError<K>
  | InferError<L>
  | InferError<M>
  | InferError<N>
>
export function union<
  A extends Struct<any, any, Error>,
  B extends Struct<any, any, Error>,
  C extends Struct<any, any, Error>,
  D extends Struct<any, any, Error>,
  E extends Struct<any, any, Error>,
  F extends Struct<any, any, Error>,
  G extends Struct<any, any, Error>,
  H extends Struct<any, any, Error>,
  I extends Struct<any, any, Error>,
  J extends Struct<any, any, Error>,
  K extends Struct<any, any, Error>,
  L extends Struct<any, any, Error>,
  M extends Struct<any, any, Error>,
  N extends Struct<any, any, Error>,
  O extends Struct<any, any, Error>
>(
  Structs: [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O]
): Struct<
  | Infer<A>
  | Infer<B>
  | Infer<C>
  | Infer<D>
  | Infer<E>
  | Infer<F>
  | Infer<G>
  | Infer<H>
  | Infer<I>
  | Infer<J>
  | Infer<K>
  | Infer<L>
  | Infer<M>
  | Infer<N>
  | Infer<O>,
  null,
  | InferError<A>
  | InferError<B>
  | InferError<C>
  | InferError<D>
  | InferError<E>
  | InferError<F>
  | InferError<G>
  | InferError<H>
  | InferError<I>
  | InferError<J>
  | InferError<K>
  | InferError<L>
  | InferError<M>
  | InferError<N>
  | InferError<O>
>
export function union<
  A extends Struct<any, any, Error>,
  B extends Struct<any, any, Error>,
  C extends Struct<any, any, Error>,
  D extends Struct<any, any, Error>,
  E extends Struct<any, any, Error>,
  F extends Struct<any, any, Error>,
  G extends Struct<any, any, Error>,
  H extends Struct<any, any, Error>,
  I extends Struct<any, any, Error>,
  J extends Struct<any, any, Error>,
  K extends Struct<any, any, Error>,
  L extends Struct<any, any, Error>,
  M extends Struct<any, any, Error>,
  N extends Struct<any, any, Error>,
  O extends Struct<any, any, Error>,
  P extends Struct<any, any, Error>
>(
  Structs: [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P]
): Struct<
  | Infer<A>
  | Infer<B>
  | Infer<C>
  | Infer<D>
  | Infer<E>
  | Infer<F>
  | Infer<G>
  | Infer<H>
  | Infer<I>
  | Infer<J>
  | Infer<K>
  | Infer<L>
  | Infer<M>
  | Infer<N>
  | Infer<O>
  | Infer<P>,
  null,
  | InferError<A>
  | InferError<B>
  | InferError<C>
  | InferError<D>
  | InferError<E>
  | InferError<F>
  | InferError<G>
  | InferError<H>
  | InferError<I>
  | InferError<J>
  | InferError<K>
  | InferError<L>
  | InferError<M>
  | InferError<N>
  | InferError<O>
  | InferError<P>
>
export function union<
  A extends Struct<any, any, Error>,
  B extends Struct<any, any, Error>,
  C extends Struct<any, any, Error>,
  D extends Struct<any, any, Error>,
  E extends Struct<any, any, Error>,
  F extends Struct<any, any, Error>,
  G extends Struct<any, any, Error>,
  H extends Struct<any, any, Error>,
  I extends Struct<any, any, Error>,
  J extends Struct<any, any, Error>,
  K extends Struct<any, any, Error>,
  L extends Struct<any, any, Error>,
  M extends Struct<any, any, Error>,
  N extends Struct<any, any, Error>,
  O extends Struct<any, any, Error>,
  P extends Struct<any, any, Error>,
  Q extends Struct<any, any, Error>
>(
  Structs: [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q]
): Struct<
  | Infer<A>
  | Infer<B>
  | Infer<C>
  | Infer<D>
  | Infer<E>
  | Infer<F>
  | Infer<G>
  | Infer<H>
  | Infer<I>
  | Infer<J>
  | Infer<K>
  | Infer<L>
  | Infer<M>
  | Infer<N>
  | Infer<O>
  | Infer<P>
  | Infer<Q>,
  null,
  | InferError<A>
  | InferError<B>
  | InferError<C>
  | InferError<D>
  | InferError<E>
  | InferError<F>
  | InferError<G>
  | InferError<H>
  | InferError<I>
  | InferError<J>
  | InferError<K>
  | InferError<L>
  | InferError<M>
  | InferError<N>
  | InferError<O>
  | InferError<P>
  | InferError<Q>
>
/*
// generate script
var keys = 'A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q'.split(',').map(s=>s.trim());
keys.map((v,i) => {
  const types = keys.slice(0, i+1);
  return `export function union<${types.map(t => `${t} extends Struct<any,any,Error>`).join(', ')}>(
  Structs: [${types.join(', ')}]
): Struct<${types.map(t => `Infer<${t}>`).join(' | ')}, null, ${types.map(t => `InferError<${t}>`).join(' | ')}>`;
}).join('\n')
*/
export function union(Structs: Struct<any, any, any>[]): any {
  const description = Structs.map((s) => s.type).join(' | ')
  return new Struct({
    type: 'union',
    schema: null,
    validator(value, ctx) {
      const failures = []

      for (const S of Structs) {
        const [...tuples] = run(value, S, ctx)
        const [first] = tuples

        if (!first[0]) {
          return []
        } else {
          for (const [failure] of tuples) {
            if (failure) {
              failures.push(failure)
            }
          }
        }
      }

      const message = `Expected the value to satisfy a union of \`${description}\`, but received: ${print(
        value
      )}`
      return [
        {
          value,
          key: ctx.path[ctx.path.length - 1],
          type: 'union',
          refinement: undefined,
          message,
          branch: ctx.branch,
          path: ctx.path,
          detail: {
            class: 'type',
            except: description,
            actually: value,
            message,
          } as TypeErrorDetail,
          failures,
        },
      ]
    },
  })
}

/**
 * Ensure that any value passes validation, without widening its type to `any`.
 */

export function unknown(): Struct<unknown, null, never> {
  return define('unknown', () => [])
}
