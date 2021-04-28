# Types

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

> 🤖 Note that if you're using TypeScript, the `any` struct will loosen the type to `any`, and you might want to use [`unknown`](#unknown) instead.

### `array`

```ts
array(number())
array(object({ id: number() }))
```

```txt
[1, 2, 3]
[{ id: 1 }]
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

### `func`

```ts
func()
```

```ts
function () {}
```

`func` structs validate that a value is a function.

### `instance`

```ts
instance(MyClass)
```

```ts
new MyClass()
```

`instance` structs validate that a value is an instance of a particular class, using JavaScript's built-in `instanceof` operator.

### `integer`

```ts
integer()
```

```txt
-7
0
42
```

`integer` structs validate that a value is an integer.

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
map(string(), number())
```

```ts
new Map([
  ['a', 1],
  ['b', 2],
])
```

`map` structs validate that a value is a `Map` object with specific types for its keys and values.

> 🤖 When defining a key/value schemas with `map` it will traverse all the properties to ensure they are valid! If you don't care about validating the properties of the map, you can write `map()` instead.

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

### `nullable`

```ts
nullable(string())
```

```ts
'a string of text'
null
```

`nullable` structs validate that a value matches a specific struct, or that it is `null`.

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

> 🤖 Note that `object` structs throw errors if they encounter extra properties on an object, unless `mask` is used! If you want to be less strict and ignore any extra properties, use [`type`](#type) instead. For other more complex object use cases, check out the [coercions](./coercions.md) and [utilities](./utilities.md) too.

### `optional`

```ts
optional(string())
```

```ts
'a string of text'
undefined
```

`optional` structs validate that a value matches a specific struct, or that it is `undefined`.

### `record`

```ts
record(string(), number())
```

```ts
{
  a: 1,
  b: 2,
}
```

`record` structs validate an object with specific types for its keys and values. But, unlike `object` structs, they do not enforce a specific set of keys.

### `regexp`

```ts
regexp()
```

```ts
;/\d+/
new RegExp()
```

`regexp` structs validate that a value is a `RegExp` object.

> 🤖 This does not test the value against the regular expression! For that you want the [`pattern`](./refinements.md#pattern) refinement.

### `set`

```ts
set(string())
```

```ts
new Set(['a', 'b', 'c'])
```

`set` structs validate that a value is a `Set` instance with elements of a specific type.

> 🤖 When defining a child schema with `set` it will traverse all the children to ensure they are valid! If you don't care about validating the elements of the set, you can write `set()` instead.

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

```txt
['a', 1, true]
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

When `mask()` is used with a value of `type`, its unknown properties are not removed. I.e. consider `type` as a signal to the core that the object may have arbitrary properties in addition to the known ones, in both masked and non-masked validation.

> 🤖 If you want to throw errors when encountering unknown properties, use [`object`](#object) instead.

### `union`

```ts
union([string(), number()])
```

```ts
'a string'
42
```

`union` structs validate that a value matches at least one of many types.

### `unknown`

```ts
unknown()
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

`unknown` structs accept unknown value as valid without loosening its type to `any`.

### Custom Types

You can also define your own custom structs that are specific to your application's requirements, like so:

```ts
import { define } from 'superstruct'
import isEmail from 'is-email'
import isUuid from 'is-uuid'

const Email = define('Email', isEmail)
const Uuid = define('Uuid', (value) => isUuid.v4(value))

const User = object({
  id: Uuid,
  name: string(),
  email: Email,
  age: number(),
})
```

Custom types take validator functions that return either `true/false` or an array of `StructFailure` objects, in case you want to build more helpful error messages.

> 🤖 If you are using Typescript the value will be of type `unknown` by default. You can pass a more specific type for Typescript:
> ```ts
> const Email = define<string>('Email', isEmail)
> ```
