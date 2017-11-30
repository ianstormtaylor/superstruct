
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
  + [`element_invalid`](#element_invalid)
  + [`property_invalid`](#property_invalid)
  + [`property_required`](#property_required)
  + [`property_unknown`](#property_unknown)
  + [`value_invalid`](#value_invalid)
  + [`value_required`](#value_required)


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

Superstruct throws detailed errors when data is invalid, so that you can build extremely precise errors of your own to give your end users the best possible experience. It uses the `error.code` property to distinguish between the different cases when an error might be thrown: 

### `element_invalid`

Thrown when an element in an array is invalid.

|**Property**|**Type**|**Example**|**Description**|
|---|---|---|---|
|`code`|`String`|`'element_invalid'`|The type of error.|
|`index`|`Number`|`0`|The index of the invalid element in the array.|
|`value`|`Any`|`...`|The invalid element's value.|
|`path`|`Array`|`[2,0]`|The path to the invalid element relative to the original data.|
|`data`|`Any`|`...`|The original data argument passed into the top-level struct.|

### `property_invalid`

Throw when a property in an object is invalid.

|**Property**|**Type**|**Example**|**Description**|
|---|---|---|---|
|`code`|`String`|`'property_invalid'`|The type of error.|
|`key`|`Number`|`'city'`|The key of the invalid property in the object.|
|`value`|`Any`|`...`|The invalid property's value.|
|`path`|`Array`|`['address', 'city']`|The path to the invalid property relative to the original data.|
|`data`|`Any`|`...`|The original data argument passed into the top-level struct.|

### `property_required`

Throw when a property in an object is required but not provided.

|**Property**|**Type**|**Example**|**Description**|
|---|---|---|---|
|`code`|`String`|`'property_required'`|The type of error.|
|`key`|`Number`|`'city'`|The key of the required property in the object.|
|`path`|`Array`|`['address', 'city']`|The path to the required property relative to the original data.|
|`data`|`Any`|`...`|The original data argument passed into the top-level struct.|

### `property_unknown`

Throw when a property in an object was provided but not defined in the struct.

|**Property**|**Type**|**Example**|**Description**|
|---|---|---|---|
|`code`|`String`|`'property_unknown'`|The type of error.|
|`key`|`Number`|`'name'`|The key of the unknown property in the object.|
|`path`|`Array`|`['address', 'name']`|The path to the unknown property relative to the original data.|
|`data`|`Any`|`...`|The original data argument passed into the top-level struct.|

### `value_invalid`

Throw when a top-level value is invalid.

|**Property**|**Type**|**Example**|**Description**|
|---|---|---|---|
|`code`|`String`|`'value_invalid'`|The type of error.|
|`value`|`Any`|`...`|The invalid value's value.|
|`path`|`Array`|`[]`|The path to the invalid value relative to the original data.|
|`data`|`Any`|`...`|The original data argument passed into the top-level struct.|

### `value_required`

Throw when a top-level value is required but not provided.

|**Property**|**Type**|**Example**|**Description**|
|---|---|---|---|
|`code`|`String`|`'value_required'`|The type of error.|
|`path`|`Array`|`[]`|The path to the required value relative to the original data.|
|`data`|`Any`|`...`|The original data argument passed into the top-level struct.|
