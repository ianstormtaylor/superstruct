# API Reference

* [API](#api)
  * [`struct`](#struct)
  * [`superstruct`](#superstruct)
  * [`Struct`](#struct)
  * [`StructError`](#structerror)
* [Structs](#structs)
  * [`any`](#any)
  * [`dict`](#dict)
  * [`enum`](#enum)
  * [`function`](#function)
  * [`instance`](#instance)
  * [`interface`](#interface)
  * [`intersection`](#intersection)
  * [`lazy`](#lazy)
  * [`list`](#list)
  * [`literal`](#literal)
  * [`object`](#object)
  * [`optional`](#optional)
  * [`partial`](#partial)
  * [`scalar`](#scalar)
  * [`union`](#union)
* [Types](#types)
  * [Built-in Types](#built-in-types)
  * [Custom Types](#custom-types)
* [Errors](#errors)
  * [Error Properties](#error-properties)
  * [Multiple Errors](#multiple-errors)

## API

Superstruct exposes the following API:

```js
import { struct, superstruct, StructError } from 'superstruct'
```

### `struct`

`struct(schema: Object|Array|String|Function, defaults: Any, options: Object) => Function`

```js
import { struct } from 'superstruct'

const Struct = struct(
  {
    id: 'number',
    name: 'string',
    is_admin: 'boolean?',
  },
  {
    is_admin: false,
  }
)

Struct({
  id: 42,
  name: 'Jane Smith',
})
```

The `struct` function ships with Superstruct by default, and recognizes all of the native JavaScript types in its definitions. It's the easiest way to quickly define structs.

If you need to define custom data types, use the [`superstruct`](#superstruct) export instead...

### `superstruct`

`superstruct(options: Object) => Function`

```js
import { superstruct } from 'superstruct'
import isEmail from 'is-email'
import isUrl from 'is-url'

const struct = superstruct({
  types: {
    email: v => isEmail(v) && v.length < 256,
    url: v => isUrl(v) && v.length < 2048,
  }
})

const Struct = struct(...)
```

The `superstruct` factory function is used to create your own `struct` function, with a set of custom data types defined. This way you can easily define structs that contain types like `'email'`, `'url'`, or whatever else your application may need.

### `Struct`

`Function(data: Any) => Any`

```js
import { struct } from 'superstruct'

const Struct = struct({
  id: 'number',
  name: 'string',
})

Struct(data)
```

`Struct` validator functions are created by the `struct` factory. You can call them directly for the basic use case. But they also have the following method properties:

#### `assert`

`assert(data: Any) => Any`

Assert that `data` is valid. If the data is invalid a [`StructError`](#structerror) will be thrown, otherwise the data will be returned with defaults applied.

#### `test`

`test(data: Any) => Boolean`

Test that `data` is valid, returning a boolean representing whether it is valid or not.

#### `validate`

`validate(data: Any) => [StructError, Any]`

Validate `data`, returning an array of `[error, result]`. If the data is invalid, the `error` will be a [`StructError`](#structerror). Otherwise, the error will be `undefined` and the `result` will be populated with the data with defaults applied.

### `StructError`

`Error`

```js
import { StructError } from 'superstruct'

if (error instanceof StructError) {
  ...
}
```

The error class that Superstruct uses for its validation errors. This is exposed primarily as a convenience for checking whether thrown errors are an `instanceof` the `StructError` class.

## Structs

Structs are defined by passing a schema definition to the `struct` function. The schema definition can be a string, array, object or function. They can also be composed by nesting structs inside each other.

### `any`

```js
struct.any(['string'])
```

```js
;['a', 'b', 'c']
```

`any` structs are the equivalent of using the `struct()` function directly, providing the shorthands for commonly used notations.

### `dict`

```js
struct.dict(['string', 'number'])
```

```js
{
  a: 1,
  b: 2,
}
```

`dict` structs validate an object's keys and values. But, unlike `object` structs, they do not enforce a specific set of keys.

### `enum`

```js
struct.enum(['Jane', 'John', 'Jack', 'Jill'])
```

```js
'Jane'
```

`enum` structs validate that a value is one of a specific set of literals.

### `function`

```js
struct((value) => typeof value === 'string')
struct.function((value) => typeof value === 'string')
```

```js
'a simple string'
```

`function` structs will validate using the validation function provided. They're helpful as an escape hatch in cases when you really need to write a one-off validation, and don't want to add it to your set of known data types.

### `instance`

```js
struct.instance(MyObject)
```

```js
new MyObject()
```

`instance` structs validate that an object is an instance of a particular class, using the built-in `instanceof` operator.

### `interface`

```js
struct.interface({
  property: 'number',
  method: 'function',
})
```

```js
{
  property: 42,
  method: () => true,
  anotherProperty: 'string',
  anotherMethod: () => false,
}
```

`interface` structs validate that a value has a set of properties on it, but it does not assert anything about unspecified properties. This allows you to assert that a particular set of functionality exists without a strict equality check for properties.

### `intersection`

```js
struct('string&email')
struct.intersection(['string', 'email'])
```

```js
'jane@example.com'
```

`intersection` structs validate that a value matches all of many structs. Their arguments are any other validate struct schema.

### `lazy`

```js
const BinaryTree = struct({
  value: 'any',
  left: struct.lazy(() => struct.optional(BinaryTree)),
  right: struct.lazy(() => struct.optional(BinaryTree)),
})
```

```js
{
  value: 4,
  left: {
    value: 2,
    left: { value: 1 },
    right: { value: 3 },
  },
  right: { value: 5 },
}
```

`lazy` structs accepts a function that will return a struct. They are useful to create recursive structs.

### `dynamic`

```js
const map = {
  TEXT: struct({
    content: 'string'
  }),
  IMAGE: struct({
    url: 'string'
  })
}

const Node = struct({
  type: struct.enum(['TEXT', 'IMAGE']),
  value: struct.dynamic((value, parent) => {
    // Make sure your function never comes back with anything but a struct.
    return map[parent.type] || struct('undefined')
  })
})

const Struct = struct({
  nodes: [Node]
})
```

```js
{
  nodes: [
    {
      type: 'TEXT',
      value: {
        content: 'Hello, world!'
      }
    },
    {
      type: 'IMAGE',
      value: {
        url: 'https://example.com/test.png'
      }
    }
  ]
}
```

Dynamic sctructs are functions that return other structs. Use this to dynamically determine the applicable struct for your dataset based on arbitrary and/or deterministic conditions.

The passed function should accept two arguments:

```js
struct.dynamic((value, parent) => SomeStruct)
```

Where `value` is the currently validated data and `parent` is the root object of `value`.

### `list`

```js
struct(['string'])
struct.list(['string'])
```

```js
;['a', 'b', 'c']
```

`list` structs will validate that all of the elements in an array match a specific type. The elements's schema can be any valid value for a struct—string, array, object or function.

### `literal`

```js
struct.literal(42)
```

```js
42
```

`literal` structs enforces that a value matches an exact, pre-defined value, using the `===` operator.

### `object`

```js
struct({
  id: 'number',
  name: 'string',
})

struct.object({
  id: 'number',
  name: 'string',
})
```

```js
{
  id: 1,
  name: 'Jane Smith',
}
```

`object` structs will validate that each of the properties in an object match a specific type. The properties's schemas can be any valid value for a struct—string, array, object or function.

### `optional`

```js
struct.optional('string')
struct('string?')
```

```js
'a string of text'
undefined
```

`optional` structs validate that a value matches a specific kind of struct, or that it is `undefined`.

### `partial`

```js
struct.partial({
  a: 'number',
  b: 'number',
})
```

```js
{
  a: 1,
  b: 2,
  c: 3,
}
```

`partial` structs are similar to `object` structs, but they only require that the specified properties exist, and they don't care about other properties on the object. They differ from `interface` structs in that they only return the specified properties.

### `scalar`

```js
struct('string')
struct.scalar('string')
```

```js
'a string of text'
```

`scalar` structs are the lowest-level type of struct. They validate that a single scalar value matches a type, denoted by a type string.

### `tuple`

```js
struct.tuple(['string', 'number', 'boolean'])
```

```js
;['a', 1, true]
```

`tuple` structs validate that a value is a specific array tuple of values.

### `union`

```js
struct('string|number')
struct.union(['string', 'number'])
```

```js
'a string'
42
```

`union` structs validate that a value matches at least one of many structs. Their arguments are any other validate struct schema.

## Types

Superstruct can be used to validate the structure of data, for things like tuples, dictionaries, lists, etc. But at the lowest level, the data being validate uses type validation functions that you can define yourself.

### Built-in Types

Out of the box, Superstruct recognizes all of the native JavaScript types:

| **Type**              | **Example**        | **Description**                   |
| --------------------- | ------------------ | --------------------------------- |
| `'any'`               | `'anything'`       | Any value other than `undefined`. |
| `'arguments'`         | `[...]`            | An `arguments` object.            |
| `'array'`             | `[1,2,3]`          | An array.                         |
| `'boolean'`           | `false`            | A boolean.                        |
| `'buffer'`            | `new Buffer()`     | A Node.js buffer.                 |
| `'date'`              | `new Date()`       | A date object.                    |
| `'error'`             | `new Error()`      | An error object.                  |
| `'function'`          | `() => true`       | A function.                       |
| `'generatorfunction'` | `function* () {}`  | A generator function.             |
| `'map'`               | `new Map()`        | A `Map` object.                   |
| `'null'`              | `null`             | The `null` primitive.             |
| `'number'`            | `42`               | A number.                         |
| `'object'`            | `{ key: 'value'}`  | A plain object.                   |
| `'promise'`           | `new Promise(...)` | A `Promise` object.               |
| `'regexp'`            | `/a-z/g`           | A regular expression object.      |
| `'set'`               | `new Set()`        | A `Set` object.                   |
| `'string'`            | `'text'`           | A string.                         |
| `'symbol'`            | `new Symbol()`     | A `Symbol`.                       |
| `'undefined'`         | `undefined`        | The `undefined` primitive.        |
| `'weakmap'`           | `new WeakMap()`    | A `WeakMap` object.               |
| `'weakset'`           | `new WeakSet()`    | A `WeakSet` object.               |

You can use them via the `{ struct }` export, like so:

```js
import { struct } from 'superstruct'

const User = struct({
  id: 'number',
  name: 'string',
  is_admin: 'boolean?',
})
```

### Custom Types

However, you can also define your own custom types that are specific to your application's requirements, using the `{ superstruct }` export, like so:

```js
import { superstruct } from 'superstruct'
import isEmail from 'is-email'
import isUuid from 'is-uuid'

const struct = superstruct({
  types: {
    email: value => isEmail(value) && value.length < 256,
    uuid: value => isUuid.v4(value),
    age: value => {
      if (value < 16) return 'age_too_small'
      if (value > 125) return 'age_too_big'
      return true
    },
  },
})

const User = struct({
  id: 'uuid',
  name: 'string',
  email: 'email',
  age: 30,
  is_admin: 'boolean?',
})
```

These custom types are simple functions that return `true/false` or a string denoting the reason the value passed in is invalid, in case you want to build more helpful error messages.

## Errors

Superstruct throws detailed errors when data is invalid, so that you can build extremely precise errors of your own to give your end users the best possible experience.

### Error Properties

Each error thrown includes the following properties:

| **Property** | **Type** | **Example**             | **Description**                                               |
| ------------ | -------- | ----------------------- | ------------------------------------------------------------- |
| `data`       | `Any`    | `...`                   | The original data argument passed into the top-level struct.  |
| `path`       | `Array`  | `['address', 'street']` | The path to the invalid value relative to the original data.  |
| `value`      | `Any`    | `...`                   | The invalid value.                                            |
| `type`       | `String` | `'string'`              | The expected scalar type of the value.                        |
| `errors`     | `Array`  | `[...]`                 | All the validation errors thrown, of which this is the first. |

### Multiple Errors

The "first" error encountered is always the one thrown, because this makes for convenient and simple logic in the majority of cases. However, the `errors` property is available with a list of all of the validation errors that occurred in case you want to add support for multiple error handling.
