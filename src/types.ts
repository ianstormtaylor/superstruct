import { Struct, StructType, coerce, StructContext } from './struct'
import { StructRecord, StructTuple } from './utils'

/**
 * Validate any value.
 */

export function any(): Struct<any> {
  return struct('any', () => true)
}

/**
 * Validate that an array of values of a specific type.
 */

export function array<T>(Element: Struct<T>): Struct<T[], Struct<T>> {
  return new Struct({
    type: `Array<${Element.type}>`,
    schema: Element,
    coercer: (value) => {
      return Array.isArray(value) ? value.map((v) => coerce(v, Element)) : value
    },
    *validator(value, ctx) {
      if (!Array.isArray(value)) {
        yield ctx.fail()
        return
      }

      for (const [i, v] of value.entries()) {
        yield* ctx.check(v, Element, value, i)
      }
    },
  })
}

/**
 * Validate that boolean values.
 */

export function boolean(): Struct<boolean> {
  return struct('boolean', (value) => {
    return typeof value === 'boolean'
  })
}

/**
 * Validate that `Date` values.
 *
 * Note: this also ensures that the value is *not* an invalid `Date` object,
 * which can occur when parsing a date fails but still returns a `Date`.
 */

export function date(): Struct<Date> {
  return struct('Date', (value) => {
    return value instanceof Date && !isNaN(value.getTime())
  })
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
 * Validate that a value against a set of potential values.
 */

export function enums<T>(values: T[]): Struct<T> {
  return struct(`Enum<${values.map(toLiteralString)}>`, (value) => {
    return values.includes(value as any)
  })
}

/**
 * Validate that a value is a function.
 */

export function func(): Struct<Function> {
  return struct('Function', (value) => {
    return typeof value === 'function'
  })
}

/**
 * Validate that a value is an instance of a class.
 */

export function instance<T extends { new (...args: any): any }>(
  Class: T
): Struct<InstanceType<T>> {
  return struct(`InstanceOf<${Class.name}>`, (value) => {
    return value instanceof Class
  })
}

/**
 * Validate that a value matches all of a set of structs.
 */

export function intersection<A>(Structs: StructTuple<[A]>): Struct<A>
export function intersection<A, B>(Structs: StructTuple<[A, B]>): Struct<A & B>
export function intersection<A, B, C>(
  Structs: StructTuple<[A, B, C]>
): Struct<A & B & C>
export function intersection<A, B, C, D>(
  Structs: StructTuple<[A, B, C, D]>
): Struct<A & B & C & D>
export function intersection<A, B, C, D, E>(
  Structs: StructTuple<[A, B, C, D, E]>
): Struct<A & B & C & D & E>
export function intersection(Structs: Struct<any>[]): any {
  return struct(Structs.map((s) => s.type).join(' & '), function* (value, ctx) {
    for (const S of Structs) {
      yield* ctx.check(value, S)
    }
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
 * Validate that a value is a specific constant.
 */

export function literal<T extends boolean>(constant: T): Struct<T>
export function literal<T extends number>(constant: T): Struct<T>
export function literal<T extends string>(constant: T): Struct<T>
export function literal<T>(constant: T): Struct<T> {
  return struct(`Literal<${toLiteralString(constant)}>`, (value) => {
    return value === constant
  })
}

/**
 * Validate that a value is a map with specific key and value entries.
 */

export function map<K, V>(Key: Struct<K>, Value: Struct<V>): Struct<Map<K, V>> {
  return struct(`Map<${Key.type},${Value.type}>`, function* (value, ctx) {
    if (!(value instanceof Map)) {
      yield ctx.fail()
      return
    }

    for (const [k, v] of value.entries()) {
      yield* ctx.check(k, Key, value, k)
      yield* ctx.check(v, Value, value, k)
    }
  })
}

/**
 * Validate that a value always fails.
 */

export function never(): Struct<never> {
  return struct('never', () => false)
}

/**
 * Validate that a value is a number.
 */

export function number(): Struct<number> {
  return struct(`number`, (value) => {
    return typeof value === 'number' && !isNaN(value)
  })
}

/**
 * Validate that an object with specific entry values.
 */

export function object<V extends StructRecord<any>>(
  Structs: V
): Struct<{ [K in keyof V]: StructType<V[K]> }, V> {
  const knowns = Object.keys(Structs)
  const Never = never()
  return new Struct({
    type: `Object<{${knowns.join(',')}}>`,
    schema: Structs,
    coercer: createObjectCoercer(Structs),
    *validator(value, ctx) {
      if (typeof value !== 'object' || value == null) {
        yield ctx.fail()
        return
      }

      const unknowns = new Set(Object.keys(value))

      for (const key of knowns) {
        unknowns.delete(key)
        const Value = Structs[key]
        const v = value[key]
        yield* ctx.check(v, Value, value, key)
      }

      for (const key of unknowns) {
        const v = value[key]
        yield* ctx.check(v, Never, value, key)
      }
    },
  })
}

/**
 * Augment a struct to make it accept optionally accept `undefined` values.
 */

export function optional<T>(S: Struct<T>): Struct<T | undefined> {
  return new Struct({
    type: `${S.type}?`,
    schema: S.schema,
    validator: (value, ctx) => {
      return value === undefined || ctx.check(value, S)
    },
  })
}

/**
 * Validate that a partial object with specific entry values.
 */

export function partial<T, V extends StructRecord<any>>(
  Structs: V | Struct<T, V>
): Struct<{ [K in keyof V]?: StructType<V[K]> }> {
  if (Structs instanceof Struct) {
    Structs = Structs.schema
  }

  const knowns = Object.keys(Structs)
  const Never = never()
  return new Struct({
    type: `Partial<{${knowns.join(',')}}>`,
    schema: Structs,
    coercer: createObjectCoercer(Structs),
    *validator(value, ctx) {
      if (typeof value !== 'object' || value == null) {
        yield ctx.fail()
        return
      }

      const unknowns = new Set(Object.keys(value))

      for (const key of knowns) {
        unknowns.delete(key)

        if (!(key in value)) {
          continue
        }

        const Value = Structs[key]
        const v = value[key]
        yield* ctx.check(v, Value, value, key)
      }

      for (const key of unknowns) {
        const v = value[key]
        yield* ctx.check(v, Never, value, key)
      }
    },
  })
}

/**
 * Validate that a value is a record with specific key and
 * value entries.
 */

export function record<K extends string | number, V>(
  Key: Struct<K>,
  Value: Struct<V>
): Struct<Record<K, V>> {
  return struct(`Record<${Key.type},${Value.type}>`, function* (value, ctx) {
    if (typeof value !== 'object' || value == null) {
      yield ctx.fail()
      return
    }

    for (const k in value) {
      const v = value[k]
      yield* ctx.check(k, Key, value, k)
      yield* ctx.check(v, Value, value, k)
    }
  })
}

/**
 * Validate that a set of values matches a specific type.
 */

export function set<T>(Element: Struct<T>): Struct<Set<T>> {
  return struct(`Set<${Element.type}>`, (value, ctx) => {
    if (!(value instanceof Set)) {
      return false
    }

    for (const val of value) {
      const [failure] = ctx.check(val, Element)

      if (failure) {
        return false
      }
    }

    return true
  })
}

/**
 * Validate that a value is a string.
 */

export function string(): Struct<string> {
  return struct('string', (value) => {
    return typeof value === 'string'
  })
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

/**
 * Validate that a value is a tuple with entries of specific types.
 */

export function tuple<A>(Elements: StructTuple<[A]>): Struct<[A]>
export function tuple<A, B>(Elements: StructTuple<[A, B]>): Struct<[A, B]>
export function tuple<A, B, C>(
  Elements: StructTuple<[A, B, C]>
): Struct<[A, B, C]>
export function tuple<A, B, C, D>(
  Elements: StructTuple<[A, B, C, D]>
): Struct<[A, B, C, D]>
export function tuple<A, B, C, D, E>(
  Elements: StructTuple<[A, B, C, D, E]>
): Struct<[A, B, C, D, E]>
export function tuple(Elements: Struct<any>[]): any {
  const Never = never()

  return struct(`[${Elements.map((s) => s.type).join(',')}]`, function* (
    value,
    ctx
  ) {
    if (!Array.isArray(value)) {
      yield ctx.fail()
      return
    }

    for (const [index, Element] of Elements.entries()) {
      const v = value[index]
      yield* ctx.check(v, Element, value, index)
    }

    if (value.length > Elements.length) {
      const index = Elements.length
      const v = value[index]
      yield* ctx.check(v, Never, value, index)
    }
  })
}

/**
 * Validate that a value matches a specific strutural interface, like the
 * structural typing that TypeScript uses.
 */

export function type<V extends StructRecord<any>>(
  Structs: V
): Struct<{ [K in keyof V]: StructType<V[K]> }> {
  const keys = Object.keys(Structs)

  return struct(`Type<{${keys.join(',')}}>`, function* (value, ctx) {
    if (typeof value !== 'object' || value == null) {
      yield ctx.fail()
      return
    }

    for (const key of keys) {
      const Value = Structs[key]
      const v = (value as any)[key]
      yield* ctx.check(v, Value, value, key)
    }
  })
}

/**
 * Validate that a value is one of a set of types.
 */

export function union<A>(Structs: StructTuple<[A]>): Struct<A>
export function union<A, B>(Structs: StructTuple<[A, B]>): Struct<A | B>
export function union<A, B, C>(
  Structs: StructTuple<[A, B, C]>
): Struct<A | B | C>
export function union<A, B, C, D>(
  Structs: StructTuple<[A, B, C, D]>
): Struct<A | B | C | D>
export function union<A, B, C, D, E>(
  Structs: StructTuple<[A, B, C, D, E]>
): Struct<A | B | C | D | E>
export function union(Structs: Struct<any>[]): any {
  return struct(`${Structs.map((s) => s.type).join(' | ')}`, function* (
    value,
    ctx
  ) {
    for (const S of Structs) {
      const [...failures] = ctx.check(value, S)

      if (failures.length === 0) {
        return
      }
    }

    yield ctx.fail()
  })
}

/**
 * Convert a value to a literal string.
 */

function toLiteralString(value: any): string {
  return typeof value === 'string'
    ? `"${value.replace(/"/g, '"')}"`
    : `${value}`
}

/**
 * Coerce the values of an object-like struct.
 */

function createObjectCoercer<V extends StructRecord<any>>(
  Structs: V
): (value: unknown) => unknown {
  const knowns = Object.keys(Structs)

  return (value) => {
    if (typeof value !== 'object' || value == null) {
      return value
    }

    const ret = {}
    const unknowns = new Set(Object.keys(value))

    for (const key of knowns) {
      unknowns.delete(key)
      const Value = Structs[key]
      const v = value[key]
      ret[key] = coerce(v, Value)
    }

    for (const key of unknowns) {
      ret[key] = value[key]
    }

    return ret
  }
}
