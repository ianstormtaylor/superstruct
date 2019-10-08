import { Validator, VALIDATORS } from './validators'
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
 * Create a struct factory with a configuration of types.
 */

export const superstruct = (
  settings: {
    types?: Record<string, Validator>
    Error?: StructErrorConstructor
  } = {}
): Superstruct => {
  const options = {
    Error: settings.Error || DefaultError,
    types: { ...VALIDATORS, ...settings.types },
  }

  /**
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
   */

  const struct = (schema: any, defaults: any): Struct => {
    return createShorthand(schema, defaults, options)
  }

  /**
   * Array structs validate that their input is an array with elements that
   * match a specific struct. You can also pass the `max` or `min` options to
   * validate the length of the array.
   *
   * ```js
   * struct.array(['number'])
   * ```
   *
   * They are similar to the `Array` type in TypeScript.
   */

  struct.array = (schema: [any], defaults: any): Struct => {
    return createArray(schema, defaults, options)
  }

  /**
   * Dynamic structs are defined by a function that is passed the value being
   * validated, and they determine which struct to use at runtime.
   *
   * ```js
   * struct.dynamic(value => StructA || StructB)
   * ```
   *
   * They are inhernetly less performant that compile-time structs, but they
   * unlock a set of possibilities that aren't possible at compile time alone.
   */

  struct.dynamic = (
    schema: (value: any, branch: Branch, path: Path) => Struct,
    defaults: any
  ): Struct => {
    return createDynamic(schema, defaults, options)
  }

  /**
   * Enum structs validate that their input is one of a set of values.
   *
   * ```js
   * struct.enum(['fruit', 'vegetable', 'meat'])
   * ```
   *
   * They are similar to the `enum` type in TypeScript.
   */

  struct.enum = (schema: any[], defaults: any): Struct => {
    return createEnum(schema, defaults, options)
  }

  /**
   * Function structs validate their input against a one-off validator function.
   *
   * ```js
   * struct.function(value => true || false)
   * ```
   *
   * They can't provide as detailed of errors as other struct types, but they do
   * allow for customization for easy one-off cases.
   */

  struct.function = (schema: Validator, defaults: any): Struct => {
    return createFunction(schema, defaults, options)
  }

  /**
   * Instance structs validate that their input is an instance of a class.
   *
   * ```js
   * struct.instance(MyClass)
   * ```
   */

  struct.instance = (schema: any, defaults: any): Struct => {
    return createInstance(schema, defaults, options)
  }

  /**
   * Interface structs validate that their input matches an interface defined as
   * a set of properties with associated types.
   *
   * ```js
   * struct.interface({
   *   length: 'number',
   *   indexOf: 'function',
   * })
   * ```
   *
   * They are similar to the structural-typing granted by TypeScript.
   */

  struct.interface = (schema: any, defaults: any): Struct => {
    return createInterface(schema, defaults, options)
  }

  /**
   * Intersection structs validate that their input matches **all** of a set of
   * different structs.
   *
   * ```js
   * struct.intersection('string & email')
   * ```
   *
   * Note: The structs will be validated in order, so validators on the right
   * can rely on the validators before them having passed.
   *
   * They are similar to the `&` operator in TypeScript.
   */

  struct.intersection = (schema: any[], defaults: any): Struct => {
    return createIntersection(schema, defaults, options)
  }

  /**
   * Lazy structs allow you to initialize a struct lazily, only initializing it
   * once on the first time it attempts to be validated.
   *
   * ```js
   * struct.lazy(() => NodeStruct)
   * ```
   *
   * They are helpful for defining recursive structs.
   */

  struct.lazy = (schema: () => Struct, defaults: any): Struct => {
    return createLazy(schema, defaults, options)
  }

  /**
   * Literal structs validate their input against a literal value.
   *
   * ```js
   * struct.literal(42)
   * ```
   */

  struct.literal = (schema: any, defaults: any): Struct => {
    return createLiteral(schema, defaults, options)
  }

  /**
   * Object structs validate that their input exactly matches an object defined
   * as a set of properties with associated types.
   *
   * ```js
   * struct.object({
   *   name: 'string',
   *   email: 'email',
   *   address: {
   *     street: 'string',
   *     city: 'string',
   *   }
   * })
   * ```
   *
   * They are similar to the `?` qualifier in TypeScript.
   */

  struct.object = (schema: {}, defaults: any): Struct => {
    return createObject(schema, defaults, options)
  }

  /**
   * Optional structs validate that their input passes a specific struct, or
   * `undefined`.
   *
   * ```js
   * struct.optional('email')
   * ```
   *
   * This is a shorthand for using `struct.union` with `undefined`.
   */

  struct.optional = (schema: any, defaults: any): Struct => {
    return createUnion([schema, 'undefined'], defaults, options)
  }

  /**
   * Partial structs validate that their input partially matches an object
   * defined as a set of properties with associated types. All of the properties
   * of the object are optional.
   *
   * ```js
   * struct.partial({
   *   id: 'string'
   * })
   * ```
   *
   * They are similar to the `Partial` utility in TypeScript.
   */

  struct.partial = (schema: {}, defaults: any): Struct => {
    return createPartial(schema, defaults, options)
  }

  /**
   * Pick structs validate that their input exactly matches a subset of an
   * object defined as a set of properties with associated types. All of the
   * properties of its schema are required, but the object can have more that it
   * does not concern itself with.
   *
   * ```js
   * struct.pick({
   *   id: 'string',
   *   name: 'string',
   * })
   * ```
   *
   * They are similar to the `Pick` utility in TypeScript.
   */

  struct.pick = (schema: {}, defaults: any): Struct => {
    return createPick(schema, defaults, options)
  }

  /**
   * Record structs validate that their input is an object with keys that match
   * one struct and values that match another. The object can have zero or many
   * properties set on it.
   *
   * ```js
   * struct.record('email', UserStruct)
   * ```
   *
   * They are similar to the `Record` utility in TypeScript.
   */

  struct.record = (schema: [any, any], defaults: any): Struct => {
    return createRecord(schema, defaults, options)
  }

  /**
   * Scalar structs validate that their input passes the `Validator` function
   * defined for a specific type by name. By default Superstruct ships with a
   * set of built-in scalars. But you can configure it with custom scalars that
   * match your domain.
   *
   * ```js
   * struct.scalar('email')
   * ```
   */

  struct.scalar = (schema: string, defaults: any): Struct => {
    return createScalar(schema, defaults, options)
  }

  /**
   * Size structs validate their input has a certain length, by checking its
   * `length` property. This works strings or arrays.
   *
   * ```js
   * struct.size([0, 7])
   * ```
   *
   * They are helpful for defining unions with array structs.
   */

  struct.size = (schema: [number, number], defaults: any): Struct => {
    return createSize(schema, defaults, options)
  }

  /**
   * Tuple structs validate that their input exactly matches a tuple of values,
   * in length and in type.
   *
   * ```js
   * struct.tuple(['string', 'boolean'])
   * ```
   */

  struct.tuple = (schema: any[], defaults: any): Struct => {
    return createTuple(schema, defaults, options)
  }

  /**
   * Union structs validate that their input matches **at least one** of a set
   * of different structs.
   *
   * ```js
   * struct.union(['string', 'email'])
   * ```
   *
   * They are similar to the `|` operator in TypeScript.
   */

  struct.union = (schema: any[], defaults: any): Struct => {
    return createUnion(schema, defaults, options)
  }

  return struct
}

/**
 * `Superstruct` objects are the factories that create different kinds of
 * structs, and encapsulate the user-defined data types.
 */

export interface Superstruct {
  (schema: any, defaults: any): Struct
  array(schema: [any], defaults: any): Struct
  dynamic(
    schema: (value: any, branch: Branch, path: Path) => Struct,
    defaults: any
  ): Struct
  enum(schema: any[], defaults: any): Struct
  function(schema: Validator, defaults: any): Struct
  instance(schema: any, defaults: any): Struct
  interface(schema: any, defaults: any): Struct
  intersection(schema: any[], defaults: any): Struct
  lazy(schema: () => Struct, defaults: any): Struct
  literal(schema: any, defaults: any): Struct
  object(schema: {}, defaults: any): Struct
  optional(schema: any, defaults: any): Struct
  partial(schema: {}, defaults: any): Struct
  pick(schema: {}, defaults: any): Struct
  record(schema: [any, any], defaults: any): Struct
  scalar(schema: string, defaults: any): Struct
  size(schema: [number, number], defaults: any): Struct
  tuple(schema: any[], defaults: any): Struct
  union(schema: any[], defaults: any): Struct
}
