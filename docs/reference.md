
# API Reference

- [API](#api)
  + [`struct`](#struct)
  + [`superstruct`](#superstruct)
  + [`Struct`](#struct)
  + [`StructError`](#structerror)
- [Structs](#structs)
  + [Scalars](#scalars)
  + [Lists](#lists)
  + [Objects](#objects)
  + [Functions](#functions)
- [Types](#types)
- [Errors](#errors)


## API

Superstruct exposes the following API:

```js
import {
  struct,
  superstruct,
  StructError,
} from 'superstruct'
```

### `struct`
`struct(schema: Object|Array|String|Function, defaults: Any, options: Object) => Function`

```js
import { struct } from 'superstruct'

const Struct = struct({
  id: 'number',
  name: 'string',
  is_admin: 'boolean?',
}, { 
  is_admin: false 
})

Struct({
  id: 42,
  name: 'Jane Smith',
})
```

The `struct` function ships with Superstruct by default, and recognizes all of the native Javascript types in its definitions. It's the easiest way to quickly define structs. 

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

#### `default`
`default(data: Any) => Any`

Apply the struct's defaults to `data`, returning the result. Usually you'll use [`assert`](#assert) or [`validate`](#validate), but this underlying method is exposed for more specific use cases.

#### `test`
`test(data: Any) => Boolean`

Test that `data` is valid, returning a boolean representing whether it is valid or not.

#### `validate`
`validate(data: Any) => Any|StructError`

Validate `data`. If the data is invalid, a [`StructError`](#structerror) will be returned. Otherwise the data will be returned with defaults applied.


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

### Scalars

```js
struct('string')
```
```js
'a string of text'
```

Scalar structs are the lowest-level type of struct. They validate that a single scalar value matches a type, denoted by a type string.

### Lists

```js
struct(['string'])
struct([{ id: 'string' }])
```
```js
['a', 'b', 'c']
[{ id: '1' }, { id: '2' }, { id: '3' }]
```

List structs will validate that all of the elements in an array match a specific type. The elements's schema can be any valid value for a struct—string, array, object or function.

### Objects

```js
struct({
  id: 'number',
  name: 'string',
  age: 'number',
})
```
```js
{
  id: 1,
  name: 'Jane Smith',
  age: 42,
}
```

Object structs will validate that each of the properties in an object match a specific type. The properties's schemas can be any valid value for a struct—string, array, object or function.

### Functions

```js
struct(() => typeof value === 'string')
```
```js
'a simple string'
```

Function structs will validate using the validation function provided. They're helpful as an escape hatch in cases when you really need to write a one-off validation, and don't want to add it to your set of known data types.


## Types

Out of the box, Superstruct recognizes all of the native Javascript types:

|**Type**|**Example**|**Description**|
|---|---|---|
|`'any'`|`'anything'`|Any value other than `undefined`.|
|`'array'`|`[1,2,3]`|An array.|
|`'boolean'`|`false`|A boolean.|
|`'buffer'`|`new Buffer()`|A Node.js buffer.|
|`'date'`|`new Date()`|A date object.|
|`'error'`|`new Error()`|An error object.|
|`'function'`|`() => true`|A function.|
|`'null'`|`null`|The `null` primitive.|
|`'number'`|`42`|A number.|
|`'object'`|`{ key: 'value'}`|A plain object.|
|`'regexp'`|`/a-z/g`|A regular expression object.|
|`'string'`|`'text'`|A string.|
|`'undefined'`|`undefined`|The `undefined` primitive.|


## Errors

Superstruct throws detailed errors when data is invalid, so that you can build extremely precise errors of your own to give your end users the best possible experience. 

Each error includes the following properties:

|**Property**|**Type**|**Example**|**Description**|
|---|---|---|---|
|`data`|`Any`|`...`|The original data argument passed into the top-level struct.|
|`path`|`Array`|`['address', 'street']`|The path to the invalid value relative to the original data.|
|`value`|`Any`|`...`|The invalid value.|
|`type`|`String`|`'string'`|The expected scalar type of the value.|
