import { Struct, StructType, check, coerce, constrain } from './struct'
import { wrap } from './failure'

type StructRecord<T> = Record<string, Struct<T>>
type StructTuple<T> = { [K in keyof T]: Struct<T[K]> }

/**
 * Validate any value.
 */

export function any(): Struct<any> {
  return new Struct()
}

/**
 * Validate that an array of values of a specific type.
 */

export function array<T>(Element: Struct<T>): Struct<T[]> {
  return new Struct({
    type: `Array<${Element.type}>`,
    coerce: value => {
      return Array.isArray(value) ? value.map(v => Element.coerce(v)) : value
    },
    *validate(value, fail) {
      if (!Array.isArray(value)) {
        yield fail()
        return
      }

      for (const [i, v] of value.entries()) {
        yield* wrap(check(v, Element), value, i)
      }
    },
  })
}

/**
 * Validate that boolean values.
 */

export function boolean(): Struct<boolean> {
  return new Struct({
    type: 'boolean',
    validate: (value, fail) => {
      return typeof value === 'boolean' ? [] : [fail()]
    },
  })
}

/**
 * Validate that `Date` values.
 *
 * Note: this also ensures that the value is *not* an invalid `Date` object,
 * which can occur when parsing a date fails but still returns a `Date`.
 */

export function date(): Struct<Date> {
  return new Struct({
    type: 'Date',
    validate: (value, fail) => {
      return value instanceof Date && !isNaN(value.getTime()) ? [] : [fail()]
    },
  })
}

/**
 * Validate that a value dynamically, determing which struct to use at runtime.
 */

export function dynamic<T>(fn: (x: unknown) => Struct<T>): Struct<T> {
  return new Struct({
    type: 'Dynamic<Struct>',
    validate: value => {
      return check(value, fn(value))
    },
  })
}

/**
 * Validate that a value against a set of potential values.
 */

export function enums<T>(values: T[]): Struct<T> {
  return new Struct({
    type: `Enum<${values.map(toLiteralString)}>`,
    validate(value, fail) {
      return values.includes(value as any) ? [] : [fail()]
    },
  })
}

/**
 * Validate that a value is an instance of a class.
 */

export function instance<T extends { new (...args: any): any }>(
  Class: T
): Struct<InstanceType<T>> {
  return new Struct({
    type: `InstanceOf<${Class.name}>`,
    validate(value, fail) {
      return value instanceof Class ? [] : [fail()]
    },
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
  return new Struct({
    type: Structs.map(s => s.type).join(' & '),
    *validate(value) {
      for (const S of Structs) {
        yield* check(value, S)
      }
    },
  })
}

/**
 * Validate a value lazily, by constructing the struct right before the first
 * validation. This is useful for cases where you want to have self-referential
 * structs for nested data structures.
 */

export function lazy<T>(fn: () => Struct<T>): Struct<T> {
  let S: Struct<T> | undefined

  return new Struct({
    type: 'Lazy<Struct>',
    validate: value => {
      if (!S) {
        S = fn()
      }

      return check(value, S)
    },
  })
}

/**
 * Augment a string or array struct to constrain its length to being between a
 * minimum and maximum size.
 */

export function length<T extends string | any[]>(
  S: Struct<T>,
  min: number,
  max: number = Infinity
): Struct<T> {
  return constrain(S, function*(value, fail) {
    if (value.length < min) {
      yield fail()
    }

    if (value.length > max) {
      yield fail()
    }
  })
}

/**
 * Validate that a value is a specific constant.
 */

export function literal<T>(constant: T): Struct<T> {
  return new Struct({
    type: `Literal<${toLiteralString(constant)}>`,
    validate(value, fail) {
      return value === constant ? [] : [fail()]
    },
  })
}

/**
 * Validate that a value is a map with specific key and value entries.
 */

export function map<K, V>(Structs: StructTuple<[K, V]>): Struct<Map<K, V>> {
  const [Key, Value] = Structs

  return new Struct({
    type: `Map<${Key.type},${Value.type}>`,
    *validate(value, fail) {
      if (!(value instanceof Map)) {
        yield fail()
        return
      }

      for (const [k, v] of value.entries()) {
        yield* wrap(check(k, Key), value, k)
        yield* wrap(check(v, Value), value, k)
      }
    },
  })
}

/**
 * Validate that a value always fails.
 */

export function never(): Struct<never> {
  return new Struct({
    type: 'never',
    validate(value, fail) {
      return [fail()]
    },
  })
}

/**
 * Validate that a value is a number.
 */

export function number(): Struct<number> {
  return new Struct({
    type: `number`,
    validate(value, fail) {
      return typeof value === 'number' && !isNaN(value) ? [] : [fail()]
    },
  })
}

/**
 * Validate that an object with specific entry values.
 */

export function object<V extends StructRecord<any>>(
  Structs: V
): Struct<{ [K in keyof V]: StructType<V[K]> }> {
  const knowns = Object.keys(Structs)
  const Never = never()

  return new Struct({
    type: `Object<{${knowns.join(',')}}>`,
    coerce(value) {
      if (typeof value !== 'object' || value == null) {
        return value
      }

      const ret = {}
      const unknowns = new Set(Object.keys(value))

      for (const key of knowns) {
        unknowns.delete(key)
        const Value = Structs[key]
        const v = value[key]
        ret[key] = Value.coerce(v)
      }

      for (const key of unknowns) {
        ret[key] = value[key]
      }

      return ret
    },
    *validate(value, fail) {
      if (typeof value !== 'object' || value == null) {
        yield fail()
        return
      }

      const unknowns = new Set(Object.keys(value))

      for (const key of knowns) {
        unknowns.delete(key)
        const Value = Structs[key]
        const v = value[key]
        yield* wrap(check(v, Value), value, key)
      }

      for (const key of unknowns) {
        const v = value[key]
        yield* wrap(check(v, Never), value, key)
      }
    },
  })
}

/**
 * Augment a struct to make it accept optionally accept `undefined` values.
 *
 * Note: If you supply a `fallback` argument, the struct will instead use that
 * value as its default value during coercion, without widening its validation
 * type to include `undefined`.
 */

export function optional<T>(S: Struct<T>): Struct<T | undefined>
export function optional<T>(S: Struct<T>, fallback: T): Struct<T>
export function optional<T>(S: Struct<T>, fallback: () => T): Struct<T>
export function optional<T>(S: Struct<T>, fallback?: any): any {
  if (fallback === undefined) {
    return new Struct({
      type: `${S.type}?`,
      validate(value) {
        return value === undefined ? [] : check(value, S)
      },
    })
  }

  return coerce(S, x => {
    return x === undefined
      ? typeof fallback === 'function'
        ? fallback()
        : fallback
      : x
  })
}

/**
 * Validate that a partial object with specific entry values.
 */

export function partial<V extends StructRecord<any>>(
  Structs: V
): Struct<{ [K in keyof V]?: StructType<V[K]> }> {
  const knowns = Object.keys(Structs)
  const Never = never()

  return new Struct({
    type: `Partial<{${knowns.join(',')}}>`,
    *validate(value, fail) {
      if (typeof value !== 'object' || value == null) {
        yield fail()
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
        yield* wrap(check(v, Value), value, key)
      }

      for (const key of unknowns) {
        const v = value[key]
        yield* wrap(check(v, Never), value, key)
      }
    },
  })
}

/**
 * Validate that a value is a record with specific key and
 * value entries.
 */

export function record<K extends string | number, V>(
  Structs: StructTuple<[K, V]>
): Struct<Record<K, V>> {
  const [Key, Value] = Structs

  return new Struct({
    type: `Record<${Key.type},${Value.type}>`,
    *validate(value, fail) {
      if (typeof value !== 'object' || value == null) {
        yield fail()
        return
      }

      for (const k in value) {
        const v = value[k]
        yield* wrap(check(k, Key), value, k)
        yield* wrap(check(v, Value), value, k)
      }
    },
  })
}

/**
 * Validate that a set of values matches a specific type.
 */

export function set<T>(Element: Struct<T>): Struct<Set<T>> {
  return new Struct({
    type: `Set<${Element.type}>`,
    *validate(value, fail) {
      if (!(value instanceof Set)) {
        yield fail()
        return
      }

      for (const val of value) {
        const [failure] = check(val, Element)

        if (failure) {
          yield fail()
          return
        }
      }
    },
  })
}

/**
 * Validate that a value is a string.
 */

export function string(): Struct<string> {
  return new Struct({
    type: 'string',
    validate(value, fail) {
      return typeof value === 'string' ? [] : [fail()]
    },
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

  return new Struct({
    type: `Type<{${keys.join(',')}}>`,
    *validate(value, fail) {
      if (typeof value !== 'object' || value == null) {
        yield fail()
        return
      }

      for (const key of keys) {
        const Value = Structs[key]
        const v = (value as any)[key]
        yield* wrap(check(v, Value), value, key)
      }
    },
  })
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

  return new Struct({
    type: `[${Elements.map(s => s.type).join(',')}]`,
    *validate(value, fail) {
      if (!Array.isArray(value)) {
        yield fail()
        return
      }

      for (const [index, Element] of Elements.entries()) {
        const v = value[index]
        yield* wrap(check(v, Element), value, index)
      }

      if (value.length > Elements.length) {
        const index = Elements.length
        const v = value[index]
        yield* wrap(check(v, Never), value, index)
      }
    },
  })
}

/**
 * Validate an unknown value, accepting anything but not narrowing the type.
 */

export function unknown(): Struct<unknown> {
  return new Struct()
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
  return new Struct({
    type: `${Structs.map(s => s.type).join(' | ')}`,
    *validate(value, fail) {
      for (const S of Structs) {
        const [...failures] = check(value, S)

        if (!failures.length) {
          return
        }
      }

      yield fail()
    },
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
