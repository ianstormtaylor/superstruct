import { Infer, Struct } from '../struct'
import { define } from './utilities'
import {
  TupleSchema,
  ObjectSchema,
  ObjectType,
  toFailures,
  print,
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
    coercer: (value) => {
      return Element && Array.isArray(value)
        ? value.map((v) => Element.coercer(v))
        : value
    },
    *validator(value, ctx) {
      if (!Array.isArray(value)) {
        yield ctx.fail(`Expected an array value, but received: ${print(value)}`)
      } else if (Element) {
        for (const [i, v] of value.entries()) {
          yield* ctx.check(v, Element, value, i)
        }
      }
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
  values: T[]
): Struct<T, { [K in T[][number]]: K }>
export function enums<T extends string>(
  values: T[]
): Struct<T, { [K in T[][number]]: K }>
export function enums<T extends number | string>(values: T[]): any {
  const schema: any = {}
  const description = values.map((v) => print(v)).join()

  for (const key of values) {
    schema[key] = key
  }

  return new Struct({
    type: 'enums',
    schema,
    validator: (value) => {
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
  return define('intersection', function* (value, ctx) {
    for (const S of Structs) {
      yield* ctx.check(value, S)
    }
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
  return define('map', function* (value, ctx) {
    if (!(value instanceof Map)) {
      yield ctx.fail(`Expected a \`Map\` object, but received: ${print(value)}`)
    } else if (Key && Value) {
      for (const [k, v] of value.entries()) {
        yield* ctx.check(k, Key, value, k)
        yield* ctx.check(v, Value, value, k)
      }
    }
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
  const { refiner } = struct
  return new Struct({
    ...struct,
    validator: (value, ctx) => {
      return value === null || ctx.check(value, struct)
    },
    refiner: function* (value, ctx) {
      if (value != null) {
        const c = { ...ctx, struct }
        yield* toFailures(refiner(value, c), c)
      }
    },
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
    *validator(value, ctx) {
      if (typeof value !== 'object' || value == null) {
        yield ctx.fail(`Expected an object, but received: ${print(value)}`)
      } else if (schema) {
        const unknowns = new Set(Object.keys(value))

        for (const key of knowns) {
          unknowns.delete(key)
          const Value = schema[key]
          const v = value[key]
          yield* ctx.check(v, Value, value, key)
        }

        for (const key of unknowns) {
          const v = value[key]
          yield* ctx.check(v, Never, value, key)
        }
      }
    },
    coercer: (value: unknown) => {
      if (!schema || typeof value !== 'object' || value == null) {
        return value
      }

      const ret = {}
      const unknowns = new Set(Object.keys(value))

      for (const key of knowns) {
        unknowns.delete(key)
        const Value = schema[key]
        const v = value[key]
        ret[key] = Value.coercer(v)
      }

      for (const key of unknowns) {
        ret[key] = value[key]
      }

      return ret
    },
  })
}

/**
 * Augment a struct to allow `undefined` values.
 */

export function optional<T, S>(struct: Struct<T, S>): Struct<T | undefined, S> {
  const { refiner } = struct
  return new Struct({
    ...struct,
    validator: (value, ctx) => {
      return value === undefined || ctx.check(value, struct)
    },
    refiner: function* (value, ctx) {
      if (value != null) {
        const c = { ...ctx, struct }
        yield* toFailures(refiner(value, c), c)
      }
    },
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
  return define('record', function* (value, ctx) {
    if (typeof value !== 'object' || value == null) {
      yield ctx.fail(`Expected an object, but received: ${print(value)}`)
    } else {
      for (const k in value) {
        const v = value[k]
        yield* ctx.check(k, Key, value, k)
        yield* ctx.check(v, Value, value, k)
      }
    }
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
  return define('set', function* (value, ctx) {
    if (!(value instanceof Set)) {
      yield ctx.fail(`Expected a \`Set\` object, but received: ${print(value)}`)
    } else if (Element) {
      for (const val of value) {
        yield* ctx.check(val, Element, value, val)
      }
    }
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

export function tuple<A>(Structs: TupleSchema<[A]>): Struct<A, null>
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

  return define('tuple', function* (value, ctx) {
    if (!Array.isArray(value)) {
      yield ctx.fail(`Expected an array, but received: ${print(value)}`)
    } else {
      for (const [index, Element] of Elements.entries()) {
        const v = value[index]
        yield* ctx.check(v, Element, value, index)
      }

      if (value.length > Elements.length) {
        const index = Elements.length
        const v = value[index]
        yield* ctx.check(v, Never, value, index)
      }
    }
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
    validator: function* (value, ctx) {
      if (typeof value !== 'object' || value == null) {
        yield ctx.fail(`Expected an object, but received: ${print(value)}`)
      } else {
        for (const key of keys) {
          const Value = schema[key]
          const v = (value as any)[key]
          yield* ctx.check(v, Value, value, key)
        }
      }
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
  return define('union', function* (value, ctx) {
    const failures = []

    for (const S of Structs) {
      const [...array] = ctx.check(value, S)

      if (array.length === 0) {
        return
      } else {
        failures.push(...array)
      }
    }

    yield ctx.fail(
      `Expected the value to satisfy a union of \`${description}\`, but received: ${print(
        value
      )}`
    )

    yield* failures
  })
}

/**
 * Ensure that any value passes validation, without widening its type to `any`.
 */

export function unknown(): Struct<unknown, null> {
  return define('unknown', () => true)
}
