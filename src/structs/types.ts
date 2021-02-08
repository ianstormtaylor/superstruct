import { Infer, Struct } from '../struct'
import { define } from './utilities'
import {
  TupleSchema,
  ObjectSchema,
  ObjectType,
  print,
  run,
  isObject,
} from '../utils'

/**
 * Ensure that any value passes validation.
 */

export function any(): Struct<any, null> {
  return define('any', () => true)
}

/**
 * Ensure that a value is an array and that its elements are of a specific type.
 *
 * Note: If you omit the element struct, the arrays elements will not be
 * iterated at all. This can be helpful for cases where performance is critical,
 * and it is preferred to using `array(any())`.
 */

export function array<T extends Struct<any>>(Element: T): Struct<Infer<T>[], T>
export function array(): Struct<unknown[], undefined>
export function array<T extends Struct<any>>(Element?: T): any {
  return new Struct({
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
        `Expected an array value, but received: ${print(value)}`
      )
    },
  })
}

/**
 * Ensure that a value is a boolean.
 */

export function boolean(): Struct<boolean, null> {
  return define('boolean', (value) => {
    return typeof value === 'boolean'
  })
}

/**
 * Ensure that a value is a valid `Date`.
 *
 * Note: this also ensures that the value is *not* an invalid `Date` object,
 * which can occur when parsing a date fails but still returns a `Date`.
 */

export function date(): Struct<Date, null> {
  return define('date', (value) => {
    return (
      (value instanceof Date && !isNaN(value.getTime())) ||
      `Expected a valid \`Date\` object, but received: ${print(value)}`
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
): Struct<T, { [K in T[][number]]: K }>
export function enums<T extends string>(
  values: readonly T[]
): Struct<T, { [K in T[][number]]: K }>
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
        `Expected one of \`${description}\`, but received: ${print(value)}`
      )
    },
  })
}

/**
 * Ensure that a value is a function.
 */

export function func(): Struct<Function, null> {
  return define('func', (value) => {
    return (
      typeof value === 'function' ||
      `Expected a function, but received: ${print(value)}`
    )
  })
}

/**
 * Ensure that a value is an instance of a specific class.
 */

export function instance<T extends { new (...args: any): any }>(
  Class: T
): Struct<InstanceType<T>, null> {
  return define('instance', (value) => {
    return (
      value instanceof Class ||
      `Expected a \`${Class.name}\` instance, but received: ${print(value)}`
    )
  })
}

/**
 * Ensure that a value is an integer.
 */

export function integer(): Struct<number, null> {
  return define('integer', (value) => {
    return (
      (typeof value === 'number' && !isNaN(value) && Number.isInteger(value)) ||
      `Expected an integer, but received: ${print(value)}`
    )
  })
}

/**
 * Ensure that a value matches all of a set of types.
 */

export function intersection<A>(Structs: TupleSchema<[A]>): Struct<A, null>
export function intersection<A, B>(
  Structs: TupleSchema<[A, B]>
): Struct<A & B, null>
export function intersection<A, B, C>(
  Structs: TupleSchema<[A, B, C]>
): Struct<A & B & C, null>
export function intersection<A, B, C, D>(
  Structs: TupleSchema<[A, B, C, D]>
): Struct<A & B & C & D, null>
export function intersection<A, B, C, D, E>(
  Structs: TupleSchema<[A, B, C, D, E]>
): Struct<A & B & C & D & E, null>
export function intersection<A, B, C, D, E, F>(
  Structs: TupleSchema<[A, B, C, D, E, F]>
): Struct<A & B & C & D & E & F, null>
export function intersection<A, B, C, D, E, F, G>(
  Structs: TupleSchema<[A, B, C, D, E, F, G]>
): Struct<A & B & C & D & E & F & G, null>
export function intersection<A, B, C, D, E, F, G, H>(
  Structs: TupleSchema<[A, B, C, D, E, F, G, H]>
): Struct<A & B & C & D & E & F & G & H, null>
export function intersection<A, B, C, D, E, F, G, H, I>(
  Structs: TupleSchema<[A, B, C, D, E, F, G, H, I]>
): Struct<A & B & C & D & E & F & G & H & I, null>
export function intersection<A, B, C, D, E, F, G, H, I, J>(
  Structs: TupleSchema<[A, B, C, D, E, F, G, H, I, J]>
): Struct<A & B & C & D & E & F & G & H & I & J, null>
export function intersection<A, B, C, D, E, F, G, H, I, J, K>(
  Structs: TupleSchema<[A, B, C, D, E, F, G, H, I, J, K]>
): Struct<A & B & C & D & E & F & G & H & I & J & K, null>
export function intersection<A, B, C, D, E, F, G, H, I, J, K, L>(
  Structs: TupleSchema<[A, B, C, D, E, F, G, H, I, J, K, L]>
): Struct<A & B & C & D & E & F & G & H & I & J & K & L, null>
export function intersection<A, B, C, D, E, F, G, H, I, J, K, L, M>(
  Structs: TupleSchema<[A, B, C, D, E, F, G, H, I, J, K, L, M]>
): Struct<A & B & C & D & E & F & G & H & I & J & K & L & M, null>
export function intersection<A, B, C, D, E, F, G, H, I, J, K, L, M, N>(
  Structs: TupleSchema<[A, B, C, D, E, F, G, H, I, J, K, L, M, N]>
): Struct<A & B & C & D & E & F & G & H & I & J & K & L & M & N, null>
export function intersection<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O>(
  Structs: TupleSchema<[A, B, C, D, E, F, G, H, I, J, K, L, M, N, O]>
): Struct<A & B & C & D & E & F & G & H & I & J & K & L & M & N & O, null>
export function intersection<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P>(
  Structs: TupleSchema<[A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P]>
): Struct<A & B & C & D & E & F & G & H & I & J & K & L & M & N & O & P, null>
export function intersection<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q>(
  Structs: TupleSchema<[A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q]>
): Struct<
  A & B & C & D & E & F & G & H & I & J & K & L & M & N & O & P & Q,
  null
>
export function intersection(Structs: Array<Struct<any, any>>): any {
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

export function literal<T extends boolean>(constant: T): Struct<T, null>
export function literal<T extends number>(constant: T): Struct<T, null>
export function literal<T extends string>(constant: T): Struct<T, null>
export function literal<T>(constant: T): Struct<T, null>
export function literal<T>(constant: T): any {
  const description = print(constant)
  return define('literal', (value) => {
    return (
      value === constant ||
      `Expected the literal \`${description}\`, but received: ${print(value)}`
    )
  })
}

/**
 * Ensure that a value is a `Map` object, and that its keys and values are of
 * specific types.
 */

export function map(): Struct<Map<unknown, unknown>, null>
export function map<K, V>(
  Key: Struct<K>,
  Value: Struct<V>
): Struct<Map<K, V>, null>
export function map<K, V>(Key?: Struct<K>, Value?: Struct<V>): any {
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
        `Expected a \`Map\` object, but received: ${print(value)}`
      )
    },
  })
}

/**
 * Ensure that no value ever passes validation.
 */

export function never(): Struct<never, null> {
  return define('never', () => false)
}

/**
 * Augment an existing struct to allow `null` values.
 */

export function nullable<T, S>(struct: Struct<T, S>): Struct<T | null, S> {
  return new Struct({
    ...struct,
    validator: (value, ctx) => value === null || struct.validator(value, ctx),
    refiner: (value, ctx) => value === null || struct.refiner(value, ctx),
  })
}

/**
 * Ensure that a value is a number.
 */

export function number(): Struct<number, null> {
  return define('number', (value) => {
    return (
      (typeof value === 'number' && !isNaN(value)) ||
      `Expected a number, but received: ${print(value)}`
    )
  })
}

/**
 * Ensure that a value is an object, that is has a known set of properties,
 * and that its properties are of specific types.
 *
 * Note: Unrecognized properties will fail validation.
 */

export function object(): Struct<Record<string, unknown>, null>
export function object<S extends ObjectSchema>(
  schema: S
): Struct<ObjectType<S>, S>
export function object<S extends ObjectSchema>(schema?: S): any {
  const knowns = schema ? Object.keys(schema) : []
  const Never = never()
  return new Struct({
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
        isObject(value) || `Expected an object, but received: ${print(value)}`
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

export function optional<T, S>(struct: Struct<T, S>): Struct<T | undefined, S> {
  return new Struct({
    ...struct,
    validator: (value, ctx) =>
      value === undefined || struct.validator(value, ctx),
    refiner: (value, ctx) => value === undefined || struct.refiner(value, ctx),
  })
}

/**
 * Ensure that a value is an object with keys and values of specific types, but
 * without ensuring any specific shape of properties.
 *
 * Like TypeScript's `Record` utility.
 */

export function record<K extends string, V>(
  Key: Struct<K>,
  Value: Struct<V>
): Struct<Record<K, V>, null> {
  return new Struct({
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
        isObject(value) || `Expected an object, but received: ${print(value)}`
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

export function regexp(): Struct<RegExp, null> {
  return define('regexp', (value) => {
    return value instanceof RegExp
  })
}

/**
 * Ensure that a value is a `Set` object, and that its elements are of a
 * specific type.
 */

export function set(): Struct<Set<unknown>, null>
export function set<T>(Element: Struct<T>): Struct<Set<T>, null>
export function set<T>(Element?: Struct<T>): any {
  return new Struct({
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
        `Expected a \`Set\` object, but received: ${print(value)}`
      )
    },
  })
}

/**
 * Ensure that a value is a string.
 */

export function string(): Struct<string, null> {
  return define('string', (value) => {
    return (
      typeof value === 'string' ||
      `Expected a string, but received: ${print(value)}`
    )
  })
}

/**
 * Ensure that a value is a tuple of a specific length, and that each of its
 * elements is of a specific type.
 */

export function tuple<A>(Structs: TupleSchema<[A]>): Struct<[A], null>
export function tuple<A, B>(Structs: TupleSchema<[A, B]>): Struct<[A, B], null>
export function tuple<A, B, C>(
  Structs: TupleSchema<[A, B, C]>
): Struct<[A, B, C], null>
export function tuple<A, B, C, D>(
  Structs: TupleSchema<[A, B, C, D]>
): Struct<[A, B, C, D], null>
export function tuple<A, B, C, D, E>(
  Structs: TupleSchema<[A, B, C, D, E]>
): Struct<[A, B, C, D, E], null>
export function tuple<A, B, C, D, E, F>(
  Structs: TupleSchema<[A, B, C, D, E, F]>
): Struct<[A, B, C, D, E, F], null>
export function tuple<A, B, C, D, E, F, G>(
  Structs: TupleSchema<[A, B, C, D, E, F, G]>
): Struct<[A, B, C, D, E, F, G], null>
export function tuple<A, B, C, D, E, F, G, H>(
  Structs: TupleSchema<[A, B, C, D, E, F, G, H]>
): Struct<[A, B, C, D, E, F, G, H], null>
export function tuple<A, B, C, D, E, F, G, H, I>(
  Structs: TupleSchema<[A, B, C, D, E, F, G, H, I]>
): Struct<[A, B, C, D, E, F, G, H, I], null>
export function tuple<A, B, C, D, E, F, G, H, I, J>(
  Structs: TupleSchema<[A, B, C, D, E, F, G, H, I, J]>
): Struct<[A, B, C, D, E, F, G, H, I, J], null>
export function tuple<A, B, C, D, E, F, G, H, I, J, K>(
  Structs: TupleSchema<[A, B, C, D, E, F, G, H, I, J, K]>
): Struct<[A, B, C, D, E, F, G, H, I, J, K], null>
export function tuple<A, B, C, D, E, F, G, H, I, J, K, L>(
  Structs: TupleSchema<[A, B, C, D, E, F, G, H, I, J, K, L]>
): Struct<[A, B, C, D, E, F, G, H, I, J, K, L], null>
export function tuple<A, B, C, D, E, F, G, H, I, J, K, L, M>(
  Structs: TupleSchema<[A, B, C, D, E, F, G, H, I, J, K, L, M]>
): Struct<[A, B, C, D, E, F, G, H, I, J, K, L, M], null>
export function tuple<A, B, C, D, E, F, G, H, I, J, K, L, M, N>(
  Structs: TupleSchema<[A, B, C, D, E, F, G, H, I, J, K, L, M, N]>
): Struct<[A, B, C, D, E, F, G, H, I, J, K, L, M, N], null>
export function tuple<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O>(
  Structs: TupleSchema<[A, B, C, D, E, F, G, H, I, J, K, L, M, N, O]>
): Struct<[A, B, C, D, E, F, G, H, I, J, K, L, M, N, O], null>
export function tuple<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P>(
  Structs: TupleSchema<[A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P]>
): Struct<[A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P], null>
export function tuple<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q>(
  Structs: TupleSchema<[A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q]>
): Struct<[A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q], null>
export function tuple(Elements: Struct<any>[]): any {
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
        `Expected an array, but received: ${print(value)}`
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
): Struct<ObjectType<S>, S> {
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
        isObject(value) || `Expected an object, but received: ${print(value)}`
      )
    },
  })
}

/**
 * Ensure that a value matches one of a set of types.
 */

export function union<A>(Structs: TupleSchema<[A]>): Struct<A, null>
export function union<A, B>(Structs: TupleSchema<[A, B]>): Struct<A | B, null>
export function union<A, B, C>(
  Structs: TupleSchema<[A, B, C]>
): Struct<A | B | C, null>
export function union<A, B, C, D>(
  Structs: TupleSchema<[A, B, C, D]>
): Struct<A | B | C | D, null>
export function union<A, B, C, D, E>(
  Structs: TupleSchema<[A, B, C, D, E]>
): Struct<A | B | C | D | E, null>
export function union<A, B, C, D, E, F>(
  Structs: TupleSchema<[A, B, C, D, E, F]>
): Struct<A | B | C | D | E | F, null>
export function union<A, B, C, D, E, F, G>(
  Structs: TupleSchema<[A, B, C, D, E, F, G]>
): Struct<A | B | C | D | E | F | G, null>
export function union<A, B, C, D, E, F, G, H>(
  Structs: TupleSchema<[A, B, C, D, E, F, G, H]>
): Struct<A | B | C | D | E | F | G | H, null>
export function union<A, B, C, D, E, F, G, H, I>(
  Structs: TupleSchema<[A, B, C, D, E, F, G, H, I]>
): Struct<A | B | C | D | E | F | G | H | I, null>
export function union<A, B, C, D, E, F, G, H, I, J>(
  Structs: TupleSchema<[A, B, C, D, E, F, G, H, I, J]>
): Struct<A | B | C | D | E | F | G | H | I | J, null>
export function union<A, B, C, D, E, F, G, H, I, J, K>(
  Structs: TupleSchema<[A, B, C, D, E, F, G, H, I, J, K]>
): Struct<A | B | C | D | E | F | G | H | I | J | K, null>
export function union<A, B, C, D, E, F, G, H, I, J, K, L>(
  Structs: TupleSchema<[A, B, C, D, E, F, G, H, I, J, K, L]>
): Struct<A | B | C | D | E | F | G | H | I | J | K | L, null>
export function union<A, B, C, D, E, F, G, H, I, J, K, L, M>(
  Structs: TupleSchema<[A, B, C, D, E, F, G, H, I, J, K, L, M]>
): Struct<A | B | C | D | E | F | G | H | I | J | K | L | M, null>
export function union<A, B, C, D, E, F, G, H, I, J, K, L, M, N>(
  Structs: TupleSchema<[A, B, C, D, E, F, G, H, I, J, K, L, M, N]>
): Struct<A | B | C | D | E | F | G | H | I | J | K | L | M | N, null>
export function union<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O>(
  Structs: TupleSchema<[A, B, C, D, E, F, G, H, I, J, K, L, M, N, O]>
): Struct<A | B | C | D | E | F | G | H | I | J | K | L | M | N | O, null>
export function union<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P>(
  Structs: TupleSchema<[A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P]>
): Struct<A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P, null>
export function union<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q>(
  Structs: TupleSchema<[A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q]>
): Struct<
  A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q,
  null
>
export function union(Structs: Struct<any>[]): any {
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

      return [
        `Expected the value to satisfy a union of \`${description}\`, but received: ${print(
          value
        )}`,
        ...failures,
      ]
    },
  })
}

/**
 * Ensure that any value passes validation, without widening its type to `any`.
 */

export function unknown(): Struct<unknown, null> {
  return define('unknown', () => true)
}
