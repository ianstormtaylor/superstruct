import type { Failure } from './error.js';
import type { Struct, Infer, Result, Context, Describe } from './struct.js';

/**
 * Check if a value is an iterator.
 *
 * @param value - The value to check.
 * @returns Whether the value is an iterator.
 */
function isIterable<Type>(value: unknown): value is Iterable<Type> {
  return isObject(value) && typeof value[Symbol.iterator] === 'function';
}

/**
 * Check if a value is a plain object.
 *
 * @param value - The value to check.
 * @returns Whether the value is a plain object.
 */
export function isObject(
  value: unknown,
): value is Record<PropertyKey, unknown> {
  return typeof value === 'object' && value !== null;
}

/**
 * Check if a value is a plain object.
 *
 * @param value - The value to check.
 * @returns Whether the value is a plain object.
 */
export function isPlainObject(value: unknown): value is { [key: string]: any } {
  if (Object.prototype.toString.call(value) !== '[object Object]') {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Return a value as a printable string.
 *
 * @param value - The value to print.
 * @returns The value as a string.
 */
export function print(value: any): string {
  if (typeof value === 'symbol') {
    return value.toString();
  }

  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  return typeof value === 'string' ? JSON.stringify(value) : `${value}`;
}

/**
 * Shift (remove and return) the first value from the `input` iterator.
 * Like `Array.prototype.shift()` but for an `Iterator`.
 *
 * @param input - The iterator to shift.
 * @returns The first value of the iterator, or `undefined` if the iterator is
 * empty.
 */
export function shiftIterator<Type>(input: Iterator<Type>): Type | undefined {
  const { done, value } = input.next();
  return done ? undefined : value;
}

/**
 * Convert a single validation result to a failure.
 *
 * @param result - The result to convert.
 * @param context - The context of the validation.
 * @param struct - The struct being validated.
 * @param value - The value being validated.
 * @returns A failure if the result is a failure, or `undefined` if the result
 * is a success.
 */
export function toFailure<Type, Schema>(
  result: string | boolean | Partial<Failure>,
  context: Context,
  struct: Struct<Type, Schema>,
  value: any,
): Failure | undefined {
  if (result === true) {
    return undefined;
  } else if (result === false) {
    // eslint-disable-next-line no-param-reassign
    result = {};
  } else if (typeof result === 'string') {
    // eslint-disable-next-line no-param-reassign
    result = { message: result };
  }

  const { path, branch } = context;
  const { type } = struct;
  const {
    refinement,
    message = `Expected a value of type \`${type}\`${
      refinement ? ` with refinement \`${refinement}\`` : ''
    }, but received: \`${print(value)}\``,
  } = result;

  return {
    value,
    type,
    refinement,
    key: path[path.length - 1],
    path,
    branch,
    ...result,
    message,
  };
}

/**
 * Convert a validation result to an iterable of failures.
 *
 * @param result - The result to convert.
 * @param context - The context of the validation.
 * @param struct - The struct being validated.
 * @param value - The value being validated.
 * @yields The failures.
 * @returns An iterable of failures.
 */
export function* toFailures<Type, Schema>(
  result: Result,
  context: Context,
  struct: Struct<Type, Schema>,
  value: any,
): IterableIterator<Failure> {
  if (!isIterable(result)) {
    // eslint-disable-next-line no-param-reassign
    result = [result];
  }

  for (const validationResult of result) {
    const failure = toFailure(validationResult, context, struct, value);

    if (failure) {
      yield failure;
    }
  }
}

/**
 * Check a value against a struct, traversing deeply into nested values, and
 * returning an iterator of failures or success.
 *
 * @param value - The value to check.
 * @param struct - The struct to check against.
 * @param options - Optional settings.
 * @param options.path - The path to the value in the input data.
 * @param options.branch - The branch of the value in the input data.
 * @param options.coerce - Whether to coerce the value before validating it.
 * @param options.mask - Whether to mask the value before validating it.
 * @param options.message - An optional message to include in the error.
 * @yields An iterator of failures or success.
 * @returns An iterator of failures or success.
 */
export function* run<Type, Schema>(
  value: unknown,
  struct: Struct<Type, Schema>,
  options: {
    path?: any[] | undefined;
    branch?: any[] | undefined;
    coerce?: boolean | undefined;
    mask?: boolean | undefined;
    message?: string | undefined;
  } = {},
): IterableIterator<[Failure, undefined] | [undefined, Type]> {
  const { path = [], branch = [value], coerce = false, mask = false } = options;
  const context: Context = { path, branch };

  if (coerce) {
    // eslint-disable-next-line no-param-reassign
    value = struct.coercer(value, context);

    if (
      mask &&
      struct.type !== 'type' &&
      isObject(struct.schema) &&
      isObject(value) &&
      !Array.isArray(value)
    ) {
      for (const key in value) {
        if (struct.schema[key] === undefined) {
          delete value[key];
        }
      }
    }
  }

  let status: 'valid' | 'not_refined' | 'not_valid' = 'valid';

  for (const failure of struct.validator(value, context)) {
    failure.explanation = options.message;
    status = 'not_valid';
    yield [failure, undefined];
  }

  for (const [innerKey, innerValue, innerStruct] of struct.entries(
    value,
    context,
  )) {
    const iterable = run(innerValue, innerStruct as Struct, {
      path: innerKey === undefined ? path : [...path, innerKey],
      branch: innerKey === undefined ? branch : [...branch, innerValue],
      coerce,
      mask,
      message: options.message,
    });

    for (const result of iterable) {
      if (result[0]) {
        status =
          result[0].refinement === null || result[0].refinement === undefined
            ? 'not_valid'
            : 'not_refined';

        yield [result[0], undefined];
      } else if (coerce) {
        // eslint-disable-next-line no-param-reassign
        value = result[1];

        if (innerKey === undefined) {
          // eslint-disable-next-line no-param-reassign
          value = innerValue;
        } else if (value instanceof Map) {
          value.set(innerKey, innerValue);
        } else if (value instanceof Set) {
          value.add(innerValue);
        } else if (isObject(value)) {
          if (innerValue !== undefined || innerKey in value) {
            value[innerKey] = innerValue;
          }
        }
      }
    }
  }

  if (status !== 'not_valid') {
    for (const failure of struct.refiner(value as Type, context)) {
      failure.explanation = options.message;
      status = 'not_refined';
      yield [failure, undefined];
    }
  }

  if (status === 'valid') {
    yield [undefined, value as Type];
  }
}

/**
 * Convert a union of type to an intersection.
 */
export type UnionToIntersection<Union> = (
  Union extends any ? (arg: Union) => any : never
) extends (arg: infer Type) => void
  ? Type
  : never;

/**
 * Assign properties from one type to another, overwriting existing.
 */
export type Assign<Type, OtherType> = Simplify<
  OtherType & Omit<Type, keyof OtherType>
>;

/**
 * A schema for enum structs.
 */
export type EnumSchema<Type extends string | number | undefined | null> = {
  [Key in NonNullable<Type>]: Key;
};

/**
 * Check if a type is a match for another whilst treating overlapping
 * unions as a match.
 */
export type IsMatch<Type, OtherType> = Type extends OtherType
  ? OtherType extends Type
    ? Type
    : never
  : never;

/**
 * Check if a type is an exact match.
 */
export type IsExactMatch<Type, OtherType> = (<Inner>() => Inner extends Type
  ? 1
  : 2) extends <Inner>() => Inner extends OtherType ? 1 : 2
  ? Type
  : never;

/**
 * Check if a type is a record type.
 */
export type IsRecord<Type> = Type extends object
  ? string extends keyof Type
    ? Type
    : never
  : never;

/**
 * Check if a type is a tuple.
 */
export type IsTuple<Type> = Type extends [any]
  ? Type
  : Type extends [any, any]
  ? Type
  : Type extends [any, any, any]
  ? Type
  : Type extends [any, any, any, any]
  ? Type
  : Type extends [any, any, any, any, any]
  ? Type
  : never;

/**
 * Check if a type is a union.
 */
export type IsUnion<Type, Union extends Type = Type> = (
  Type extends any ? (Union extends Type ? false : true) : false
) extends false
  ? never
  : Type;

/**
 * A schema for object structs.
 */
export type ObjectSchema = Record<string, Struct<any, any>>;

/**
 * Infer a type from an object struct schema.
 */
export type ObjectType<Schema extends ObjectSchema> = Simplify<
  Optionalize<{ [K in keyof Schema]: Infer<Schema[K]> }>
>;

/**
 * Omit properties from a type that extend from a specific type.
 */

export type OmitBy<Type, Value> = Omit<
  Type,
  {
    [Key in keyof Type]: Value extends Extract<Type[Key], Value> ? Key : never;
  }[keyof Type]
>;

/**
 * Normalize properties of a type that allow `undefined` to make them optional.
 */
export type Optionalize<Schema extends object> = OmitBy<Schema, undefined> &
  Partial<PickBy<Schema, undefined>>;

/**
 * Transform an object schema type to represent a partial.
 */

export type PartialObjectSchema<Schema extends ObjectSchema> = {
  [K in keyof Schema]: Struct<Infer<Schema[K]> | undefined>;
};

/**
 * Pick properties from a type that extend from a specific type.
 */

export type PickBy<Type, Value> = Pick<
  Type,
  {
    [Key in keyof Type]: Value extends Extract<Type[Key], Value> ? Key : never;
  }[keyof Type]
>;

/**
 * Simplifies a type definition to its most basic representation.
 */

export type Simplify<Type> = Type extends any[] | Date
  ? Type
  : // eslint-disable-next-line @typescript-eslint/ban-types
    { [Key in keyof Type]: Type[Key] } & {};

export type If<Condition extends boolean, Then, Else> = Condition extends true
  ? Then
  : Else;

/**
 * A schema for any type of struct.
 */

export type StructSchema<Type> = [Type] extends [string | undefined | null]
  ? [Type] extends [IsMatch<Type, string | undefined | null>]
    ? null
    : [Type] extends [IsUnion<Type>]
    ? EnumSchema<Type>
    : Type
  : [Type] extends [number | undefined | null]
  ? [Type] extends [IsMatch<Type, number | undefined | null>]
    ? null
    : [Type] extends [IsUnion<Type>]
    ? EnumSchema<Type>
    : Type
  : [Type] extends [boolean]
  ? [Type] extends [IsExactMatch<Type, boolean>]
    ? null
    : Type
  : Type extends
      | bigint
      | symbol
      | undefined
      | null
      // eslint-disable-next-line @typescript-eslint/ban-types
      | Function
      | Date
      | Error
      | RegExp
      | Map<any, any>
      | WeakMap<any, any>
      | Set<any>
      | WeakSet<any>
      | Promise<any>
  ? null
  : Type extends (infer Inner)[]
  ? Type extends IsTuple<Type>
    ? null
    : Struct<Inner>
  : Type extends object
  ? Type extends IsRecord<Type>
    ? null
    : { [K in keyof Type]: Describe<Type[K]> }
  : null;

/**
 * A schema for tuple structs.
 */
export type TupleSchema<Type> = { [K in keyof Type]: Struct<Type[K]> };

/**
 * Shorthand type for matching any `Struct`.
 */

export type AnyStruct = Struct<any, any>;

/**
 * Infer a tuple of types from a tuple of `Struct`s.
 *
 * This is used to recursively retrieve the type from `union` `intersection` and
 * `tuple` structs.
 */

export type InferStructTuple<
  Tuple extends AnyStruct[],
  Length extends number = Tuple['length'],
> = Length extends Length
  ? number extends Length
    ? Tuple
    : InferTuple<Tuple, Length, []>
  : never;

type InferTuple<
  Tuple extends AnyStruct[],
  Length extends number,
  Accumulated extends unknown[],
  Index extends number = Accumulated['length'],
> = Index extends Length
  ? Accumulated
  : InferTuple<Tuple, Length, [...Accumulated, Infer<Tuple[Index]>]>;
