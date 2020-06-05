import {
  Struct,
  StructType,
  struct,
  coerce,
  toFailures,
  StructContext,
} from './struct'

type StructRecord<T> = Record<string, Struct<T>>
type StructTuple<T> = { [K in keyof T]: Struct<T[K]> }

/**
 * Validate any value.
 */

export function any(): Struct<any> {
  return struct('any', () => true)
}

/**
 * Validate that an array of values of a specific type.
 */

export function array<T>(Element: Struct<T>): Struct<T[]> {
  return struct(
    `Array<${Element.type}>`,
    function*(value, ctx) {
      if (!Array.isArray(value)) {
        yield ctx.fail()
        return
      }

      for (const [i, v] of value.entries()) {
        yield* ctx.check(v, Element, value, i)
      }
    },
    value => {
      return Array.isArray(value) ? value.map(v => coerce(v, Element)) : value
    }
  )
}

/**
 * Validate that boolean values.
 */

export function boolean(): Struct<boolean> {
  return struct('boolean', value => {
    return typeof value === 'boolean'
  })
}

/**
 * Augment a `Struct` to add an additional coercion step to its input.
 */

export function coercion<T>(
  struct: Struct<T>,
  coercer: Struct<T>['coercer']
): Struct<T> {
  const fn = struct.coercer
  return new Struct({
    ...struct,
    coercer: value => {
      return fn(coercer(value))
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
  return struct('Date', value => {
    return value instanceof Date && !isNaN(value.getTime())
  })
}

/**
 * Augment a struct to coerce a default value for missing values.
 *
 * Note: You must use `coerce(value, Struct)` on the value before validating it
 * to have the value defaulted!
 */

export function defaulted<T>(
  S: Struct<T>,
  fallback: any,
  strict?: true
): Struct<T> {
  return coercion(S, x => {
    const f = typeof fallback === 'function' ? fallback() : fallback

    if (x === undefined) {
      return f
    }

    if (strict !== true && isPlainObject(x) && isPlainObject(f)) {
      const ret = { ...x }
      let changed = false

      for (const key in f) {
        if (ret[key] === undefined) {
          ret[key] = f[key]
          changed = true
        }
      }

      if (changed) {
        return ret
      }
    }

    return x
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
  return struct(`Enum<${values.map(toLiteralString)}>`, value => {
    return values.includes(value as any)
  })
}

/**
 * Validate that a value is an instance of a class.
 */

export function instance<T extends { new (...args: any): any }>(
  Class: T
): Struct<InstanceType<T>> {
  return struct(`InstanceOf<${Class.name}>`, value => {
    return value instanceof Class
  })
}

/**
 * Validate that a value is an integer.
 */

export function integer(): Struct<number> {
  return struct(`integer`, value => {
    return typeof value === 'number' && Number.isInteger(value)
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
  return struct(Structs.map(s => s.type).join(' & '), function*(value, ctx) {
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
 * Augment a string or array struct to constrain its length to being between a
 * minimum and maximum size.
 */

export function length<T extends string | any[]>(
  S: Struct<T>,
  min: number,
  max: number = Infinity
): Struct<T> {
  return refinement(S, `${S.type} & Length<${min},${max}>`, value => {
    return min < value.length && value.length < max
  })
}

/**
 * Validate that a value is a specific constant.
 */

export function literal<T>(constant: T): Struct<T> {
  return struct(`Literal<${toLiteralString(constant)}>`, value => {
    return value === constant
  })
}

/**
 * Validate that a value is a map with specific key and value entries.
 */

export function map<K, V>(Structs: StructTuple<[K, V]>): Struct<Map<K, V>> {
  const [Key, Value] = Structs

  return struct(`Map<${Key.type},${Value.type}>`, function*(value, ctx) {
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
  return struct(`number`, value => {
    return typeof value === 'number' && !isNaN(value)
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

  return struct(
    `Object<{${knowns.join(',')}}>`,
    function*(value, ctx) {
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
    value => {
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
  )
}

/**
 * Augment a struct to make it accept optionally accept `undefined` values.
 */

export function optional<T>(S: Struct<T>): Struct<T | undefined> {
  return struct(`${S.type}?`, (value, ctx) => {
    return value === undefined || ctx.check(value, S)
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

  return struct(`Partial<{${knowns.join(',')}}>`, function*(value, ctx) {
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
  })
}

/**
 * Refine a string struct to match a specific regexp pattern.
 */

export function pattern<T extends string>(
  S: Struct<T>,
  regexp: RegExp
): Struct<T> {
  return refinement(S, `${S.type} & Pattern<${regexp.source}>`, value => {
    return regexp.test(value)
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

  return struct(`Record<${Key.type},${Value.type}>`, function*(value, ctx) {
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
 * Augment a `Struct` to add an additional refinement to the validation.
 */

export function refinement<T>(
  struct: Struct<T>,
  type: string,
  refiner: Struct<T>['refiner']
): Struct<T> {
  const fn = struct.refiner
  return new Struct({
    ...struct,
    type,
    *refiner(value, fail) {
      yield* toFailures(fn(value, fail), fail)
      yield* toFailures(refiner(value, fail), fail)
    },
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
  return struct('string', value => {
    return typeof value === 'string'
  })
}

/**
 * Coerce a string value to ensure it is trimmed.
 */

export function trimmed<T extends string>(S: Struct<T>): Struct<T> {
  return coercion(S, x => {
    return typeof x === 'string' ? x.trim() : x
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

  return struct(`[${Elements.map(s => s.type).join(',')}]`, function*(
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

  return struct(`Type<{${keys.join(',')}}>`, function*(value, ctx) {
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
 * Validate an unknown value, accepting anything but not narrowing the type.
 */

export function unknown(): Struct<unknown> {
  return struct('unknown', () => true)
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
  return struct(`${Structs.map(s => s.type).join(' | ')}`, function*(
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
 * Check if a value is a plain object.
 */

function isPlainObject(value: unknown): value is Object {
  if (Object.prototype.toString.call(value) !== '[object Object]') {
    return false
  }

  const prototype = Object.getPrototypeOf(value)
  return prototype === null || prototype === Object.prototype
}

/**
 * Convert a value to a literal string.
 */

function toLiteralString(value: any): string {
  return typeof value === 'string'
    ? `"${value.replace(/"/g, '"')}"`
    : `${value}`
}
