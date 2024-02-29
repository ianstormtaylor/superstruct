import type { Infer } from '../struct.js';
import { Struct } from '../struct.js';
import type {
  ObjectSchema,
  ObjectType,
  AnyStruct,
  InferStructTuple,
  UnionToIntersection,
} from '../utils.js';
import { print, run, isObject } from '../utils.js';
import { define } from './utilities.js';

/**
 * Ensure that any value passes validation.
 *
 * @returns A struct that will always pass validation.
 */
export function any(): Struct<any, null> {
  return define('any', () => true);
}

/**
 * Ensure that a value is an array and that its elements are of a specific type.
 *
 * Note: If you omit the element struct, the arrays elements will not be
 * iterated at all. This can be helpful for cases where performance is critical,
 * and it is preferred to using `array(any())`.
 *
 * @param Element - The struct to validate each element in the array against.
 * @returns A new struct that will only accept arrays of the given type.
 */
export function array<Type extends Struct<any>>(
  Element: Type,
): Struct<Infer<Type>[], Type>;

/**
 * Ensure that a value is an array and that its elements are of a specific type.
 *
 * Note: If you omit the element struct, the arrays elements will not be
 * iterated at all. This can be helpful for cases where performance is critical,
 * and it is preferred to using `array(any())`.
 *
 * @returns A new struct that will accept any array.
 */
export function array(): Struct<unknown[], undefined>;

/**
 * Ensure that a value is an array and that its elements are of a specific type.
 *
 * Note: If you omit the element struct, the arrays elements will not be
 * iterated at all. This can be helpful for cases where performance is critical,
 * and it is preferred to using `array(any())`.
 *
 * @param Element - The struct to validate each element in the array against.
 * @returns A new struct that will only accept arrays of the given type.
 */
export function array<Type extends Struct<any>>(Element?: Type): any {
  return new Struct({
    type: 'array',
    schema: Element,
    *entries(value) {
      if (Element && Array.isArray(value)) {
        for (const [index, arrayValue] of value.entries()) {
          yield [index, arrayValue, Element];
        }
      }
    },
    coercer(value) {
      return Array.isArray(value) ? value.slice() : value;
    },
    validator(value) {
      return (
        Array.isArray(value) ||
        `Expected an array value, but received: ${print(value)}`
      );
    },
  });
}

/**
 * Ensure that a value is a bigint.
 *
 * @returns A new struct that will only accept bigints.
 */
export function bigint(): Struct<bigint, null> {
  return define('bigint', (value) => {
    return typeof value === 'bigint';
  });
}

/**
 * Ensure that a value is a boolean.
 *
 * @returns A new struct that will only accept booleans.
 */
export function boolean(): Struct<boolean, null> {
  return define('boolean', (value) => {
    return typeof value === 'boolean';
  });
}

/**
 * Ensure that a value is a valid `Date`.
 *
 * Note: this also ensures that the value is *not* an invalid `Date` object,
 * which can occur when parsing a date fails but still returns a `Date`.
 *
 * @returns A new struct that will only accept valid `Date` objects.
 */
export function date(): Struct<Date, null> {
  return define('date', (value) => {
    return (
      (value instanceof Date && !isNaN(value.getTime())) ||
      `Expected a valid \`Date\` object, but received: ${print(value)}`
    );
  });
}

/**
 * Ensure that a value is one of a set of potential values.
 *
 * Note: after creating the struct, you can access the definition of the
 * potential values as `struct.schema`.
 *
 * @param values - The potential values that the input can be.
 * @returns A new struct that will only accept the given values.
 */
export function enums<Type extends number, Values extends readonly Type[]>(
  values: Values,
): Struct<Values[number], { [Key in Values[number]]: Key }>;

/**
 * Ensure that a value is one of a set of potential values.
 *
 * Note: after creating the struct, you can access the definition of the
 * potential values as `struct.schema`.
 *
 * @param values - The potential values that the input can be.
 * @returns A new struct that will only accept the given values.
 */
export function enums<Type extends string, Values extends readonly Type[]>(
  values: Values,
): Struct<Values[number], { [Key in Values[number]]: Key }>;

/**
 * Ensure that a value is one of a set of potential values.
 *
 * Note: after creating the struct, you can access the definition of the
 * potential values as `struct.schema`.
 *
 * @param values - The potential values that the input can be.
 * @returns A new struct that will only accept the given values.
 */
export function enums<
  Type extends string | number,
  Values extends readonly Type[],
>(values: Values): any {
  const schema: any = {};
  const description = values.map((value) => print(value)).join();

  for (const key of values) {
    schema[key] = key;
  }

  return new Struct({
    type: 'enums',
    schema,
    validator(value) {
      return (
        values.includes(value as any) ||
        `Expected one of \`${description}\`, but received: ${print(value)}`
      );
    },
  });
}

/**
 * Ensure that a value is a function.
 *
 * @returns A new struct that will only accept functions.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function func(): Struct<Function, null> {
  return define('func', (value) => {
    return (
      typeof value === 'function' ||
      `Expected a function, but received: ${print(value)}`
    );
  });
}

/**
 * Ensure that a value is an instance of a specific class.
 *
 * @param Class - The class that the value must be an instance of.
 * @returns A new struct that will only accept instances of the given class.
 */
export function instance<Type extends new (...args: any) => any>(
  Class: Type,
): Struct<InstanceType<Type>, null> {
  return define('instance', (value) => {
    return (
      value instanceof Class ||
      `Expected a \`${Class.name}\` instance, but received: ${print(value)}`
    );
  });
}

/**
 * Ensure that a value is an integer.
 *
 * @returns A new struct that will only accept integers.
 */
export function integer(): Struct<number, null> {
  return define('integer', (value) => {
    return (
      (typeof value === 'number' && !isNaN(value) && Number.isInteger(value)) ||
      `Expected an integer, but received: ${print(value)}`
    );
  });
}

/**
 * Ensure that a value matches all of a set of types.
 *
 * @param Structs - The set of structs that the value must match.
 * @returns A new struct that will only accept values that match all of the
 * given structs.
 */
export function intersection<First extends AnyStruct, Rest extends AnyStruct[]>(
  Structs: [First, ...Rest],
): Struct<
  Infer<First> & UnionToIntersection<InferStructTuple<Rest>[number]>,
  null
> {
  return new Struct({
    type: 'intersection',
    schema: null,
    *entries(value, context) {
      for (const { entries } of Structs) {
        yield* entries(value, context);
      }
    },
    *validator(value, context) {
      for (const { validator } of Structs) {
        yield* validator(value, context);
      }
    },
    *refiner(value, context) {
      for (const { refiner } of Structs) {
        yield* refiner(value, context);
      }
    },
  });
}

/**
 * Ensure that a value is an exact value, using `===` for comparison.
 *
 * @param constant - The exact value that the input must be.
 * @returns A new struct that will only accept the exact given value.
 */
export function literal<Type extends boolean>(
  constant: Type,
): Struct<Type, Type>;

/**
 * Ensure that a value is an exact value, using `===` for comparison.
 *
 * @param constant - The exact value that the input must be.
 * @returns A new struct that will only accept the exact given value.
 */
export function literal<Type extends number>(
  constant: Type,
): Struct<Type, Type>;

/**
 * Ensure that a value is an exact value, using `===` for comparison.
 *
 * @param constant - The exact value that the input must be.
 * @returns A new struct that will only accept the exact given value.
 */
export function literal<Type extends string>(
  constant: Type,
): Struct<Type, Type>;

/**
 * Ensure that a value is an exact value, using `===` for comparison.
 *
 * @param constant - The exact value that the input must be.
 * @returns A new struct that will only accept the exact given value.
 */
export function literal<Type>(constant: Type): Struct<Type, null>;

/**
 * Ensure that a value is an exact value, using `===` for comparison.
 *
 * @param constant - The exact value that the input must be.
 * @returns A new struct that will only accept the exact given value.
 */
export function literal<Type>(constant: Type): any {
  const description = print(constant);
  const valueType = typeof constant;
  return new Struct({
    type: 'literal',
    schema:
      valueType === 'string' ||
      valueType === 'number' ||
      valueType === 'boolean'
        ? constant
        : null,

    validator(value) {
      return (
        value === constant ||
        `Expected the literal \`${description}\`, but received: ${print(value)}`
      );
    },
  });
}

/**
 * Ensure that a value is a `Map` object, and that its keys and values are of
 * specific types.
 *
 * @returns A new struct that will only accept `Map` objects.
 */
export function map(): Struct<Map<unknown, unknown>, null>;

/**
 * Ensure that a value is a `Map` object, and that its keys and values are of
 * specific types.
 *
 * @param Key - The struct to validate each key in the map against.
 * @param Value - The struct to validate each value in the map against.
 * @returns A new struct that will only accept `Map` objects.
 */
export function map<Key, Value>(
  Key: Struct<Key>,
  Value: Struct<Value>,
): Struct<Map<Key, Value>, null>;

/**
 * Ensure that a value is a `Map` object, and that its keys and values are of
 * specific types.
 *
 * @param Key - The struct to validate each key in the map against.
 * @param Value - The struct to validate each value in the map against.
 * @returns A new struct that will only accept `Map` objects.
 */
export function map<Key, Value>(Key?: Struct<Key>, Value?: Struct<Value>): any {
  return new Struct({
    type: 'map',
    schema: null,
    *entries(value) {
      if (Key && Value && value instanceof Map) {
        for (const [mapKey, mapValue] of value.entries()) {
          yield [mapKey as string, mapKey, Key];
          yield [mapKey as string, mapValue, Value];
        }
      }
    },
    coercer(value) {
      return value instanceof Map ? new Map(value) : value;
    },
    validator(value) {
      return (
        value instanceof Map ||
        `Expected a \`Map\` object, but received: ${print(value)}`
      );
    },
  });
}

/**
 * Ensure that no value ever passes validation.
 *
 * @returns A new struct that will never pass validation.
 */
export function never(): Struct<never, null> {
  return define('never', () => false);
}

/**
 * Augment an existing struct to allow `null` values.
 *
 * @param struct - The struct to augment.
 * @returns A new struct that will accept `null` values.
 */
export function nullable<Type, Schema>(
  struct: Struct<Type, Schema>,
): Struct<Type | null, Schema> {
  return new Struct({
    ...struct,
    validator: (value, ctx) => value === null || struct.validator(value, ctx),
    refiner: (value, ctx) => value === null || struct.refiner(value, ctx),
  });
}

/**
 * Ensure that a value is a number.
 *
 * @returns A new struct that will only accept numbers.
 */
export function number(): Struct<number, null> {
  return define('number', (value) => {
    return (
      (typeof value === 'number' && !isNaN(value)) ||
      `Expected a number, but received: ${print(value)}`
    );
  });
}

/**
 * Ensure that a value is an object, that it has a known set of properties,
 * and that its properties are of specific types.
 *
 * Note: Unrecognized properties will fail validation.
 *
 * @returns A new struct that will only accept objects.
 */
export function object(): Struct<Record<string, unknown>, null>;

/**
 * Ensure that a value is an object, that it has a known set of properties,
 * and that its properties are of specific types.
 *
 * Note: Unrecognized properties will fail validation.
 *
 * @param schema - An object that defines the structure of the object.
 * @returns A new struct that will only accept objects.
 */
export function object<Schema extends ObjectSchema>(
  schema: Schema,
): Struct<ObjectType<Schema>, Schema>;

/**
 * Ensure that a value is an object, that it has a known set of properties,
 * and that its properties are of specific types.
 *
 * Note: Unrecognized properties will fail validation.
 *
 * @param schema - An object that defines the structure of the object.
 * @returns A new struct that will only accept objects.
 */
export function object<Schema extends ObjectSchema>(
  schema?: Schema | undefined,
): any {
  const knowns = schema ? Object.keys(schema) : [];
  const Never = never();
  return new Struct({
    type: 'object',
    schema: schema ?? null,
    *entries(value) {
      if (schema && isObject(value)) {
        const unknowns = new Set(Object.keys(value));

        for (const key of knowns) {
          unknowns.delete(key);
          yield [key, value[key], schema[key] as Struct<any>];
        }

        for (const key of unknowns) {
          yield [key, value[key], Never];
        }
      }
    },
    validator(value) {
      return (
        isObject(value) || `Expected an object, but received: ${print(value)}`
      );
    },
    coercer(value) {
      return isObject(value) ? { ...value } : value;
    },
  });
}

/**
 * Augment a struct to allow `undefined` values.
 *
 * @param struct - The struct to augment.
 * @returns A new struct that will accept `undefined` values.
 */
export function optional<Type, Schema>(
  struct: Struct<Type, Schema>,
): Struct<Type | undefined, Schema> {
  return new Struct({
    ...struct,
    validator: (value, ctx) =>
      value === undefined || struct.validator(value, ctx),
    refiner: (value, ctx) => value === undefined || struct.refiner(value, ctx),
  });
}

/**
 * Ensure that a value is an object with keys and values of specific types, but
 * without ensuring any specific shape of properties.
 *
 * Like TypeScript's `Record` utility.
 */

/**
 * Ensure that a value is an object with keys and values of specific types, but
 * without ensuring any specific shape of properties.
 *
 * @param Key - The struct to validate each key in the record against.
 * @param Value - The struct to validate each value in the record against.
 * @returns A new struct that will only accept objects.
 */
export function record<Key extends string, Value>(
  Key: Struct<Key>,
  Value: Struct<Value>,
): Struct<Record<Key, Value>, null> {
  return new Struct({
    type: 'record',
    schema: null,
    *entries(value) {
      if (isObject(value)) {
        // eslint-disable-next-line guard-for-in
        for (const objectKey in value) {
          const objectValue = value[objectKey];
          yield [objectKey, objectKey, Key];
          yield [objectKey, objectValue, Value];
        }
      }
    },
    validator(value) {
      return (
        isObject(value) || `Expected an object, but received: ${print(value)}`
      );
    },
  });
}

/**
 * Ensure that a value is a `RegExp`.
 *
 * Note: this does not test the value against the regular expression! For that
 * you need to use the `pattern()` refinement.
 *
 * @returns A new struct that will only accept `RegExp` objects.
 */
export function regexp(): Struct<RegExp, null> {
  return define('regexp', (value) => {
    return value instanceof RegExp;
  });
}

/**
 * Ensure that a value is a `Set` object, and that its elements are of a
 * specific type.
 *
 * @returns A new struct that will only accept `Set` objects.
 */
export function set(): Struct<Set<unknown>, null>;

/**
 * Ensure that a value is a `Set` object, and that its elements are of a
 * specific type.
 *
 * @param Element - The struct to validate each element in the set against.
 * @returns A new struct that will only accept `Set` objects.
 */
export function set<Type>(Element: Struct<Type>): Struct<Set<Type>, null>;

/**
 * Ensure that a value is a `Set` object, and that its elements are of a
 * specific type.
 *
 * @param Element - The struct to validate each element in the set against.
 * @returns A new struct that will only accept `Set` objects.
 */
export function set<Type>(Element?: Struct<Type>): any {
  return new Struct({
    type: 'set',
    schema: null,
    *entries(value) {
      if (Element && value instanceof Set) {
        for (const setValue of value) {
          yield [setValue as string, setValue, Element];
        }
      }
    },
    coercer(value) {
      return value instanceof Set ? new Set(value) : value;
    },
    validator(value) {
      return (
        value instanceof Set ||
        `Expected a \`Set\` object, but received: ${print(value)}`
      );
    },
  });
}

/**
 * Ensure that a value is a string.
 *
 * @returns A new struct that will only accept strings.
 */
export function string(): Struct<string, null> {
  return define('string', (value) => {
    return (
      typeof value === 'string' ||
      `Expected a string, but received: ${print(value)}`
    );
  });
}

/**
 * Ensure that a value is a tuple of a specific length, and that each of its
 * elements is of a specific type.
 *
 * @param Structs - The set of structs that the value must match.
 * @returns A new struct that will only accept tuples of the given types.
 */
export function tuple<First extends AnyStruct, Rest extends AnyStruct[]>(
  Structs: [First, ...Rest],
): Struct<[Infer<First>, ...InferStructTuple<Rest>], null> {
  const Never = never();

  return new Struct({
    type: 'tuple',
    schema: null,
    *entries(value) {
      if (Array.isArray(value)) {
        const length = Math.max(Structs.length, value.length);

        for (let i = 0; i < length; i++) {
          yield [i, value[i], Structs[i] || Never];
        }
      }
    },
    validator(value) {
      return (
        Array.isArray(value) ||
        `Expected an array, but received: ${print(value)}`
      );
    },
  });
}

/**
 * Ensure that a value has a set of known properties of specific types.
 *
 * Note: Unrecognized properties are allowed and untouched. This is similar to
 * how TypeScript's structural typing works.
 *
 * @param schema - An object that defines the structure of the object.
 * @returns A new struct that will only accept objects.
 */
export function type<Schema extends ObjectSchema>(
  schema: Schema,
): Struct<ObjectType<Schema>, Schema> {
  const keys = Object.keys(schema);
  return new Struct({
    type: 'type',
    schema,
    *entries(value) {
      if (isObject(value)) {
        for (const k of keys) {
          yield [k, value[k], schema[k] as Struct<any>];
        }
      }
    },
    validator(value) {
      return (
        isObject(value) || `Expected an object, but received: ${print(value)}`
      );
    },
    coercer(value) {
      return isObject(value) ? { ...value } : value;
    },
  });
}

/**
 * Ensure that a value matches one of a set of types.
 *
 * @param Structs - The set of structs that the value must match.
 * @returns A new struct that will only accept values that match one of the
 * given structs.
 */
export function union<First extends AnyStruct, Rest extends AnyStruct[]>(
  Structs: [First, ...Rest],
): Struct<Infer<First> | InferStructTuple<Rest>[number], null> {
  const description = Structs.map((struct) => struct.type).join(' | ');
  return new Struct({
    type: 'union',
    schema: null,
    coercer(value) {
      for (const { validate } of Structs) {
        const [error, coerced] = validate(value, { coerce: true });
        if (!error) {
          return coerced;
        }
      }

      return value;
    },
    validator(value, ctx) {
      const failures = [];

      for (const InnerStruct of Structs) {
        const [...tuples] = run(value, InnerStruct, ctx);
        const [first] = tuples;

        if (!first?.[0]) {
          return [];
        }

        for (const [failure] of tuples) {
          if (failure) {
            failures.push(failure);
          }
        }
      }

      return [
        `Expected the value to satisfy a union of \`${description}\`, but received: ${print(
          value,
        )}`,
        ...failures,
      ];
    },
  });
}

/**
 * Ensure that any value passes validation, without widening its type to `any`.
 *
 * @returns A struct that will always pass validation.
 */
export function unknown(): Struct<unknown, null> {
  return define('unknown', () => true);
}
