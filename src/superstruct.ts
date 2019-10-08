import { Validator, Types } from './types'
import {
  Branch,
  Path,
  StructError as DefaultError,
  StructErrorConstructor,
} from './struct-error'
import { Struct } from './struct'
import {
  createArray,
  createDynamic,
  createEnum,
  createFunction,
  createInstance,
  createInterface,
  createIntersection,
  createLazy,
  createLiteral,
  createObject,
  createPartial,
  createPick,
  createRecord,
  createScalar,
  createShorthand,
  createSize,
  createTuple,
  createUnion,
} from './structs'

/**
 * Create a struct singleton with settings that include your own domain-specific
 * data `types`, and an optional custom `Error` class.
 */

export const superstruct = (
  settings: {
    types?: Record<string, Validator>
    Error?: StructErrorConstructor
  } = {}
): Superstruct => {
  const options = {
    Error: settings.Error || DefaultError,
    types: { ...Types, ...settings.types },
  }

  const struct = (schema: any, defaults: any): Struct => {
    return createShorthand(schema, defaults, options)
  }

  struct.array = (schema: [any], defaults: any): Struct => {
    return createArray(schema, defaults, options)
  }

  struct.dynamic = (
    schema: (value: any, branch: Branch, path: Path) => Struct,
    defaults: any
  ): Struct => {
    return createDynamic(schema, defaults, options)
  }

  struct.enum = (schema: any[], defaults: any): Struct => {
    return createEnum(schema, defaults, options)
  }

  struct.function = (schema: Validator, defaults: any): Struct => {
    return createFunction(schema, defaults, options)
  }

  struct.instance = (schema: any, defaults: any): Struct => {
    return createInstance(schema, defaults, options)
  }

  struct.interface = (schema: any, defaults: any): Struct => {
    return createInterface(schema, defaults, options)
  }

  struct.intersection = (schema: any[], defaults: any): Struct => {
    return createIntersection(schema, defaults, options)
  }

  struct.lazy = (schema: () => Struct, defaults: any): Struct => {
    return createLazy(schema, defaults, options)
  }

  struct.literal = (schema: any, defaults: any): Struct => {
    return createLiteral(schema, defaults, options)
  }

  struct.object = (schema: {}, defaults: any): Struct => {
    return createObject(schema, defaults, options)
  }

  struct.optional = (schema: any, defaults: any): Struct => {
    return createUnion([schema, 'undefined'], defaults, options)
  }

  struct.partial = (schema: {}, defaults: any): Struct => {
    return createPartial(schema, defaults, options)
  }

  struct.pick = (schema: {}, defaults: any): Struct => {
    return createPick(schema, defaults, options)
  }

  struct.record = (schema: [any, any], defaults: any): Struct => {
    return createRecord(schema, defaults, options)
  }

  struct.scalar = (schema: string, defaults: any): Struct => {
    return createScalar(schema, defaults, options)
  }

  struct.size = (schema: [number, number], defaults: any): Struct => {
    return createSize(schema, defaults, options)
  }

  struct.tuple = (schema: any[], defaults: any): Struct => {
    return createTuple(schema, defaults, options)
  }

  struct.union = (schema: any[], defaults: any): Struct => {
    return createUnion(schema, defaults, options)
  }

  return struct
}

/**
 * `Superstruct` factories create different kinds of [[Struct]] validators, and
 * encapsulate the user-defined data types.
 *
 * The [[struct]] export is a factory that ships with Superstruct by default,
 * pre-configured with all of the built-in JavaScript data types. It's the
 * easiest way to quickly define structs:
 *
 * ```js
 * import { struct } from 'superstruct'
 *
 * const User = struct({
 *   id: 'number',
 *   name: 'string',
 * })
 * ```
 *
 * If you need to define custom data types, you can define your own by using
 * the [[superstruct]] export:
 *
 * ```js
 * import { superstruct } from 'superstruct'
 * import isEmail from 'is-email'
 * import isUrl from 'is-url'
 *
 * const struct = superstruct({
 *   types: {
 *     email: value => isEmail(value) && value.length < 256,
 *     url: value => isUrl(value) && value.length < 2048,
 *   }
 * })
 *
 * const User = struct({
 *   id: 'number',
 *   name: 'string',
 *   email: 'email',
 *   website: 'url?',
 * })
 * ```
 *
 * This way you can easily define structs that contain types like `'email'`,
 * `'url'`, or whatever else your application may need.
 */

export interface Superstruct {
  /**
   * Structs are defined by passing a schema definition to the struct factory.
   * The schema definition can be a string, array, object or function. They can
   * also be composed by nesting structs inside each other.
   *
   * The default struct factory allows you to write structs using a shorthand
   * syntax for the most common cases—arrays, objects, scalars, tuples, etc.
   *
   * ```js
   * struct('string') // Scalars
   * struct(['number']) // Arrays
   * struct({ name: 'string' }) // Objects
   * struct(['error', 'string']) // Tuples
   * struct('number?') // Optional
   * struct('string & email') // Intersection
   * struct('number | string') // Union
   * struct(value => true || false) // Function
   * struct(Struct) // Pass-through
   * ```
   *
   * Each shorthand is equivalent to a method on the [[Superstruct]] factory:
   *
   * ```js
   * // These are equivalent...
   * struct(['number'])
   * struct.array(['number'])
   *
   * struct('string & email')
   * struct.union(['string', 'email'])
   * ```
   *
   * And each one can use your custom types, or even other structs:
   *
   * ```js
   * struct('email')
   * struct(User)
   * ```
   *
   * The second argument to struct factories is always a `defaults` value. It
   * can either be the default itself or a function that returns the default.
   *
   * ```js
   * struct('id', uuid.v4)
   *
   * struct({
   *   id: 'number',
   *   name: 'string',
   *   is_admin: 'boolean?',
   * }, {
   *   is_admin: false,
   * })
   * ```
   */

  (schema: any, defaults: any): Struct

  /**
   * Array structs validate that their input is an array with elements that
   * match a specific struct. You can also pass the `max` or `min` options to
   * validate the length of the array.
   *
   * ```js
   * const Struct = struct.array(['number'])
   *
   * Struct([1, 2, 3])
   * ```
   *
   * They are similar to the `Array` type in TypeScript.
   */

  array(schema: [any], defaults: any): Struct

  /**
   * Dynamic structs are defined by a function that is passed the value being
   * validated, and they determine which struct to use at runtime.
   *
   * ```js
   * const Struct = struct.dynamic(value => StructA || StructB)
   * ```
   *
   * They are inhernetly less performant that compile-time structs, but they
   * unlock a set of possibilities that aren't possible at compile time alone.
   */

  dynamic(
    schema: (value: any, branch: Branch, path: Path) => Struct,
    defaults: any
  ): Struct

  /**
   * Enum structs validate that their input is one of a set of values.
   *
   * ```js
   * const Struct = struct.enum(['fruit', 'vegetable', 'meat'])
   *
   * Struct('fruit')
   * ```
   *
   * They are similar to the `enum` type in TypeScript.
   */

  enum(schema: any[], defaults: any): Struct

  /**
   * Function structs validate their input against a one-off validator function.
   *
   * ```js
   * const Struct = struct.function(value => typeof value === 'string')
   *
   * Struct('a simple string')
   * ```
   *
   * They can't provide as detailed of errors as other struct types, but they do
   * allow for customization for easy one-off cases.
   */

  function(schema: Validator, defaults: any): Struct

  /**
   * Instance structs validate that their input is an instance of a class.
   *
   * ```js
   * const Struct = struct.instance(MyClass)
   *
   * Struct(new MyClass())
   * ```
   */

  instance(schema: any, defaults: any): Struct

  /**
   * Interface structs validate that their input matches an interface defined as
   * a set of properties with associated types.
   *
   * ```js
   * const Struct = struct.interface({
   *   length: 'number',
   *   indexOf: 'function',
   * })
   *
   * Struct([1, 2, 3])
   * Struct('abc')
   * ```
   *
   * They are similar to the structural-typing granted by TypeScript.
   */

  interface(schema: any, defaults: any): Struct

  /**
   * Intersection structs validate that their input matches **all** of a set of
   * different structs.
   *
   * ```js
   * const Struct = struct.intersection('string & email')
   *
   * Struct('jane@example.com')
   * ```
   *
   * Note: The structs will be validated in order, so validators on the right
   * can rely on the validators before them having passed.
   *
   * They are similar to the `&` operator in TypeScript.
   */

  intersection(schema: any[], defaults: any): Struct

  /**
   * Lazy structs allow you to initialize a struct lazily, only initializing it
   * once on the first time it attempts to be validated.
   *
   * ```js
   * const Struct = struct({
   *   nodes: struct.lazy(() => Struct)
   * })
   *
   * Struct({
   *   nodes: {
   *     nodes: { ... }
   *   }
   * })
   * ```
   *
   * They are helpful for defining recursive structs.
   */

  lazy(schema: () => Struct, defaults: any): Struct

  /**
   * Literal structs validate their input against a literal value.
   *
   * ```js
   * const Struct = struct.literal(42)
   *
   * Struct(42)
   * ```
   */

  literal(schema: any, defaults: any): Struct

  /**
   * Object structs validate that their input exactly matches an object defined
   * as a set of properties with associated types.
   *
   * ```js
   * const Struct = struct.object({
   *   id: 'number',
   *   name: 'string',
   * })
   *
   * Struct({
   *   id: 1,
   *   name: 'Jane Smith',
   * })
   * ```
   *
   * They are similar to the `?` qualifier in TypeScript.
   */

  object(schema: {}, defaults: any): Struct

  /**
   * Optional structs validate that their input passes a specific struct, or
   * `undefined`.
   *
   * ```js
   * const Struct = struct.optional('string?')
   *
   * Struct('a string of text')
   * Struct(undefined)
   * ```
   *
   * This is a shorthand for using `struct.union` with `undefined`.
   */

  optional(schema: any, defaults: any): Struct

  /**
   * Partial structs validate that their input partially matches an object
   * defined as a set of properties with associated types. All of the properties
   * of the object are optional.
   *
   * ```js
   * const Struct = struct.partial({
   *   id: 'number'
   *   name: 'string',
   * })
   *
   * Struct({
   *   name: 'Jane Smith',
   * })
   * ```
   *
   * They are similar to the `Partial` utility in TypeScript.
   */

  partial(schema: {}, defaults: any): Struct

  /**
   * Pick structs validate that their input exactly matches a subset of an
   * object defined as a set of properties with associated types. All of the
   * properties of its schema are required, but the object can have more that it
   * does not concern itself with.
   *
   * ```js
   * const Struct = struct.pick({
   *   id: 'string',
   *   name: 'string',
   * })
   *
   * Struct({
   *   id: 1,
   *   name: 'James Smith',
   *   email: 'james@example.com',
   * })
   * ```
   *
   * They are similar to the `Pick` utility in TypeScript.
   */

  pick(schema: {}, defaults: any): Struct

  /**
   * Record structs validate that their input is an object with keys that match
   * one struct and values that match another. The object can have zero or many
   * properties set on it.
   *
   * ```js
   * const Struct = struct.record('string', 'number')
   *
   * Struct({
   *   a: 1,
   *   b: 2,
   * })
   * ```
   *
   * They are similar to the `Record` utility in TypeScript.
   */

  record(schema: [any, any], defaults: any): Struct

  /**
   * Scalar structs validate that their input passes the `Validator` function
   * defined for a specific type by name. By default Superstruct ships with a
   * set of built-in scalars. But you can configure it with custom scalars that
   * match your domain.
   *
   * ```js
   * const Struct = struct.scalar('string')
   *
   * Struct('a string of text')
   * ```
   */

  scalar(schema: string, defaults: any): Struct

  /**
   * Size structs validate their input has a certain length, by checking its
   * `length` property. This works strings or arrays.
   *
   * ```js
   * const Struct = struct.size([0, 7])
   *
   * Struct([1, 2, 3])
   * Struct('abcdefg')
   * ```
   *
   * They are helpful for defining unions with array structs.
   */

  size(schema: [number, number], defaults: any): Struct

  /**
   * Tuple structs validate that their input exactly matches a tuple of values,
   * in length and in type.
   *
   * ```js
   * const Struct = struct.tuple(['string', 'boolean'])
   *
   * Struct(['one', true])
   * ```
   */

  tuple(schema: any[], defaults: any): Struct

  /**
   * Union structs validate that their input matches **at least one** of a set
   * of different structs.
   *
   * ```js
   * const Struct = struct.union(['string', 'number'])
   *
   * Struct('a string')
   * Struct(42)
   * ```
   *
   * They are similar to the `|` operator in TypeScript.
   */

  union(schema: any[], defaults: any): Struct
}
