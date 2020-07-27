# API Reference

- [API Reference](#api-reference)
  - [Validation](#validation)
    - [`assert`](#assert)
    - [`coerce`](#coerce)
    - [`is`](#is)
    - [`validate`](#validate)
  - [Types](#types)
    - [`any`](#any)
    - [`array`](#array)
    - [`boolean`](#boolean)
    - [`date`](#date)
    - [`enums`](#enums)
    - [`instance`](#instance)
    - [`intersection`](#intersection)
    - [`literal`](#literal)
    - [`map`](#map)
    - [`never`](#never)
    - [`number`](#number)
    - [`object`](#object)
    - [`optional`](#optional)
    - [`nullable`](#nullable)
    - [`partial`](#partial)
    - [`record`](#record)
    - [`set`](#set)
    - [`string`](#string)
    - [`tuple`](#tuple)
    - [`type`](#type)
    - [`union`](#union)
    - [Custom Types](#custom-types)
  - [Refinements](#refinements)
    - [`empty`](#empty)
    - [`length`](#length)
    - [`pattern`](#pattern)
    - [Custom Refinements](#custom-refinements)
  - [Coercions](#coercions)
    - [`defaulted`](#defaulted)
    - [`masked`](#masked)
    - [Custom Coercions](#custom-coercions)
  - [Errors](#errors)
    - [`StructError`](#structerror)
    - [Error Properties](#error-properties)
    - [Multiple Errors](#multiple-errors)
  - [Utilities](#utilities)
    - [`StructType`](#structtype)

## Validation

### `assert`

`assert<T>(value: unknown, struct: Struct<T>) => asserts value is T`

Assert that `value` is valid according to a `struct`. If the value is invalid a [`StructError`](#structerror) will be thrown.

> 🤖 When using TypeScript `is` acts as an assertion guard, so you can ensure that after calling it the `value` matches the shape of the struct.

### `coerce`

`coerce<T>(value: unknown, struct: Struct<T>) => unknown`

Coerce a `value` using the coercion logic that is built-in to the struct, returning the newly coerced value.

> 🤖 If you want coercion logic like defaulted values, you **must** call this helper before running validation.

### `is`

`is<T>(value: unknown, struct: Struct<T>) => value is T`

Test that `value` is valid, returning a boolean representing whether it is valid or not.

> 🤖 When using TypeScript `is` acts as a type guard, so you can use it in an `if` statement to ensure that inside the statement the `value` matches the shape of the struct.

### `validate`

`validate<T>(value: unknown, struct: Struct<T>) => [StructError, T]`

Validate `value`, returning a result tuple. If the value is invalid the first element will be a [`StructError`](#structerror). Otherwise, the first element will be `undefined` and the second element will be a value that is guaranteed to match the struct.

## Types

Superstruct exposes factory functions for a variety of common JavaScript (and TypeScript) types. You can also define your own custom validation functions using the `struct` factory.

### `any`

```ts
any()
```

```ts
'valid'
42
true
undefined
null
{
  also: 'valid'
}
```

`any` structs accept any value as valid.

### `array`

```ts
array(number())
array(object({ id: string() }))
```

```ts
;[1, 2, 3][{ id: '1' }]
```

`array` structs accept a list of values of a specific type.

### `boolean`

```ts
boolean()
```

```ts
true
false
```

`boolean` structs accept the boolean values `true` and `false`.

### `date`

```ts
date()
```

```ts
new Date()
```

`date` structs accept JavaScript `Date` instances.

> 🤖 To avoid unexpected runtime errors, `date` structs do **not** accept invalid `Date` objects, even though they are technically an instance of a `Date`. This meshes with the 99% use case where invalid dates create inconsistencies.

### `enums`

```ts
enums(['Jane', 'John', 'Jack', 'Jill'])
```

```ts
'Jane'
'John'
```

`enums` structs validate that a value is one of a specific set of literals values.

### `instance`

```ts
instance(MyClass)
```

```ts
new MyClass()
```

`instance` structs validate that a value is an instance of a particular class, using JavaScript's built-in `instanceof` operator.

### `intersection`

```ts
intersection([string(), Email])
```

```ts
'jane@example.com'
```

`intersection` structs validate that a value matches **all** of many structs. It takes existing struct objects as arguments.

### `literal`

```ts
literal(42)
```

```ts
42
```

`literal` structs enforce that a value matches an exact value using the `===` operator.

### `map`

```ts
map([string(), number()])
```

```ts
new Map([
  ['a', 1],
  ['b', 2],
])
```

`map` structs validate that a value is a `Map` object with specific types for its keys and values.

### `never`

```ts
never()
```

```ts
```

`never` structs will fail validation for **every** value.

### `number`

```ts
number()
```

```ts
0
3.14
42
Infinity
```

`number` structs validate that a value is a number.

### `object`

```ts
struct({
  id: number(),
  name: string(),
})
```

```ts
{
  id: 1,
  name: 'Jane Smith',
}
```

`object` structs validate that a value is an object and that each of its properties match a specific type as well.

### `optional`

```ts
optional(string())
```

```ts
'a string of text'
undefined
```

`optional` structs validate that a value matches a specific struct, or that it is `undefined`.

### `nullable`

```ts
nullable(string())
```

```ts
'a string of text'
nullable
```

`nullable` structs validate that a value matches a specific struct, or that it is `null`.

### `partial`

```ts
partial({
  a: number(),
  b: number(),
})
```

```ts
{
  a: 1,
  b: 2,
  c: 3,
}
```

`partial` structs are similar to `object` structs, but they only require that the specified properties exist, and they don't care about other properties on the object.

### `record`

```ts
record([string(), number()])
```

```ts
{
  a: 1,
  b: 2,
}
```

`record` structs validate an object with specific types for its keys and values. But, unlike `object` structs, they do not enforce a specific set of keys.

### `set`

```ts
set(string())
```

```ts
new Set(['a', 'b', 'c'])
```

`set` structs validate that a value is a `Set` instance with elements of a specific type.

### `string`

```ts
string()
```

```ts
'a string of text'
```

`string` structs validate that a value is a string.

### `tuple`

```ts
tuple([string(), number(), boolean()])
```

```ts
;['a', 1, true]
```

`tuple` structs validate that a value is an array of a specific length with values each of a specific type.

### `type`

```ts
type({
  name: string(),
  walk: func(),
})
```

```ts
{
  name: 'Jill',
  age: 37,
  race: 'human',
  walk: () => {},
}
```

`type` structs validate that a value has a set of properties on it, but it does not assert anything about unspecified properties. This allows you to assert that a particular set of functionality exists without a strict equality check for properties.

### `union`

```ts
union([string(), number()])
```

```ts
'a string'
42
```

`union` structs validate that a value matches at least one of many types.

### Custom Types

You can also define your own custom structs that are specific to your application's requirements, like so:

```ts
import { struct } from 'superstruct'
import isEmail from 'is-email'
import isUuid from 'is-uuid'

const Email = struct('Email', isEmail)
const Uuid = struct('Uuid', (value) => isUuid.v4(value))

const User = object({
  id: Uuid,
  name: string(),
  email: Email,
  age: number(),
})
```

Custom types take validator functions that return either `true/false` or an array of `StructFailure` objects, in case you want to build more helpful error messages.

## Refinements

Superstruct allows you to constrain existing structs with further validation. This doesn't change the type of the struct, but simply introduces extra validation logic. This can be useful for example when ensuring that a string matches a specific `RegExp`.

### `empty`

```ts
import { empty } from 'superstruct'
```

```ts
empty(string())
empty(array())
```

```ts
''
[]
```

`empty` enforces that a `string` or `array` struct also requires a length of `0`.

### `length`

```ts
import { length } from 'superstruct'
```

```ts
length(string(), 1, 100)

length(array(number), 0, Infinity)
```

```ts
'a string of text'[(1, 2, 3)]
```

`length` enforces that a `string` or `array` struct also is within a certain `min` and `max` length.

### `pattern`

```ts
import { pattern } from 'superstruct'
```

```ts
pattern(string(), /\d+/)
```

```ts
'123'
```

`pattern` enforces that a `string` struct also matches a supplied `RegExp`.

### Custom Refinements

You can also define your own custom refinments that are specific to your application's requirements, like so:

```ts
import { refinement } from 'superstruct'

const PositiveInteger = refinement(number(), 'PositiveInteger', (value) => {
  return Number.isInteger(value) && value >= 0
})
```

This allows you to define more fine-grained runtime validation, while still preserving the `number` type at compile time.

## Coercions

Superstruct allows structs to be augmented with coercion logic, allowing you to transform input data before validating it. This is most commonly used to apply default values to an input, but it can be used for more complex cases like pre-trimming strings, or pre-parsing inputs.

### `defaulted`

```ts
import { defaulted } from 'superstruct'
```

```ts
defaulted(string(), 'Untitled')

defaulted(object({
  id: defaulted(number(), () => i++),
  name: string(),
  role: defaulted(enums(['admin', 'member', 'guest']), 'guest'),
})
```

`defaulted` augments a struct to add coercion logic for default values, which are applied when the input is `undefined`.

### `masked`

```ts
import { masked } from 'superstruct'
```

```ts
masked(
  object({
    name: string(),
  })
)
```

`masked` augments an object struct to strip any unknown properties from the input when coercing it.

> 🤖 If you add `defaulted` to an `object` struct with a dictionary of values, those values will be mixed in one-by-one, so the input doesn't need to be `undefined`, but certain properties can be `undefined`.

### Custom Coercions

You can also define your own custom coercions that are specific to your application's requirements, like so:

```ts
import { coercion } from 'superstruct'

const PositiveInteger = coercion(string(), (value) => {
  return typeof value === 'string' ? value.trim() : value
})
```

This allows you to customize how lenient you want to be in accepting data with your structs.

> 🤖 Note that the `value` argument passed to coercion handlers is of type `unknown`! This is because it has yet to be validated, so it could still be anything. Make sure your coercion functions guard against unknown types.

## Errors

Superstruct throws detailed errors when data is invalid, so that you can build extremely precise errors of your own to give your end users the best possible experience.

### `StructError`

`Error`

```ts
import { StructError } from 'superstruct'

if (error instanceof StructError) {
  ...
}
```

The error class that Superstruct uses for its validation errors. This is exposed primarily as a convenience for checking whether thrown errors are an `instanceof` the `StructError` class.

### Error Properties

Each error thrown includes the following properties:

| **Property** | **Type**                     | **Example**             | **Description**                                                                                                                                                                                                        |
| ------------ | ---------------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `branch`     | `Array<any>`                 | `[{...}, false]`        | An array of the values being validated at every layer. The first element in the array is the root value, and the last element is the current value that failed. This allows you to inspect the entire validation tree. |
| `path`       | `Array<string | number>`     | `['address', 'street']` | The path to the invalid value relative to the root value.                                                                                                                                                              |
| `value`      | `any`                        | `false`                 | The invalid value.                                                                                                                                                                                                     |
| `type`       | `string`                     | `'string'`              | The expected type of the invalid value.                                                                                                                                                                                |
| `failures`   | `() => Array<StructFailure>` |                         | A function that returns all the validation failures that were encountered. The error object always represents the first failure, but you can write more complex logic involving other failures if you need to.         |

### Multiple Errors

The error thrown by Superstruct is always the first validation failure that was encountered, because this makes for convenient and simple logic in the majority of cases. However, the `failures` method will return a list of all of the validation failures that occurred in case you want to add support for multiple error handling.

## Utilities

### `StructType`

When working in TypeScript, you can use the `StructType` utility type to infer the valid value of a struct definition. This allows you to avoid having to duplicate effort when writing typings.

For example:

```ts
const User = object({
  id: number(),
  name: string(),
})

type User = StructType<typeof User>
// type User = {
//   id: number
//   name: string
// }
```
