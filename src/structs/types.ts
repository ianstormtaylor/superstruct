import { Infer, Struct } from '../struct'
import { define } from './utilities'
import {
  ObjectSchema,
  ObjectType,
  print,
  run,
  isObject,
  AnyStruct,
  InferStructTuple,
  UnionToIntersection,
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
 * Ensure that a value is a bigint.
 */

export function bigint(): Struct<bigint, null> {
  return define('bigint', (value) => {
    return typeof value === 'bigint'
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

export function intersection<A extends AnyStruct, B extends AnyStruct[]>(
  Structs: [A, ...B]
): Struct<Infer<A> & UnionToIntersection<InferStructTuple<B>[number]>, null> {
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

export function literal<T extends boolean>(constant: T): Struct<T, T>
export function literal<T extends number>(constant: T): Struct<T, T>
export function literal<T extends string>(constant: T): Struct<T, T>
export function literal<T>(constant: T): Struct<T, null>
export function literal<T>(constant: T): any {
  const description = print(constant)
  const t = typeof constant
  return new Struct({
    type: 'literal',
    schema:
      t === 'string' || t === 'number' || t === 'boolean' ? constant : null,
    validator(value) {
      return (
        value === constant ||
        `Expected the literal \`${description}\`, but received: ${print(value)}`
      )
    },
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

export function tuple<A extends AnyStruct, B extends AnyStruct[]>(
  Structs: [A, ...B]
): Struct<[Infer<A>, ...InferStructTuple<B>], null> {
  const Never = never()

  return new Struct({
    type: 'tuple',
    schema: null,
    *entries(value) {
      if (Array.isArray(value)) {
        const length = Math.max(Structs.length, value.length)

        for (let i = 0; i < length; i++) {
          yield [i, value[i], Structs[i] || Never]
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

export function union<A extends AnyStruct, B extends AnyStruct[]>(
  Structs: [A, ...B]
): Struct<Infer<A> | InferStructTuple<B>[number], null> {
  const description = Structs.map((s) => s.type).join(' | ')
  return new Struct({
    type: 'union',
    schema: null,
    coercer(value, ctx) {
      const firstMatch =
        Structs.find((s) => {
          const [e] = s.validate(value, { coerce: true })
          return !e
        }) || unknown()
      return firstMatch.coercer(value, ctx)
    },
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
