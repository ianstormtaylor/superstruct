
<p align="center">
  <a href="#"><img src="./docs/images/banner.png" /></a>
</p>

<p align="center">
  A simple and composable way  <br/>
  to validate data in Javascript.
</p>
<br/>

<p align="center">
  <a href="https://www.npmjs.com/package/superstruct">
    <img src="https://img.shields.io/npm/dt/superstruct.svg?maxAge=2592000">
  </a> 
  <a href="https://unpkg.com/superstruct/dist/superstruct.min.js">
    <img src="http://img.badgesize.io/https://unpkg.com/superstruct/dist/superstruct.min.js?compression=gzip&amp;label=superstruct">
  </a>
  <a href="https://travis-ci.org/ianstormtaylor/superstruct">
    <img src="https://travis-ci.org/ianstormtaylor/superstruct.svg?branch=master">
  </a> 
  <a href="./packages/superstruct/package.json">
    <img src="https://img.shields.io/npm/v/superstruct.svg?maxAge=2592000&label=superstruct&colorB=007ec6">
  </a> 
  <a href="./License.md">
    <img src="https://img.shields.io/npm/l/superstruct.svg?maxAge=2592000">
  </a> 
</p>
<br/>

Superstruct makes it easy to define interfaces and then validate Javascript data against them. Its type annotation API was inspired by [Typescript](https://www.typescriptlang.org/docs/handbook/basic-types.html), [Flow](https://flow.org/en/docs/types/) and [GraphQL](http://graphql.org/learn/schema/). But Superstruct is designed for runtime data validations, for example when accepting input in a REST or GraphQL API.


<br/>

### Example

Superstruct exports a `struct` factory for creating functions that validate data against a specific schema:

```js
import struct from 'superstruct'

const validate = struct({
  id: 'number!',
  title: 'string!',
  created_at: 'date!',
  is_published: 'boolean!',
  tags: ['string!'],
  author: {
    id: 'number!',
    name: 'string!',
  }
})

const data = {
  id: 34,
  title: 'Hello World',
  created_at: new Date(),
  is_published: true,
  tags: ['announcements'],
  author: {
    id: 1,
    name: 'Jane Smith',
  } 
}

try {
  validate(data)
} catch (e) {
  console.error('Article object was invalid!')
  return
}

console.log('Article object was valid!')
```

The schema definition syntax was inspired by [Typescript](https://www.typescriptlang.org/docs/handbook/basic-types.html), [Flow](https://flow.org/en/docs/types/) and [GraphQL](http://graphql.org/learn/schema/).

But you can also define your own types—specific to your application's requirements—by using the exported `createStruct` function. For example:

```js
import { createStruct } from 'superstruct'

import is from 'is'
import isUuid from 'is-uuid'
import isEmail from 'is-email'
import isIsoDate from 'is-isodate'

const struct = createStruct({
  types: {
    uuid: v => isUuid.v5(v),
    name: v => is.string(v) && v.length < 256,
    email: v => isEmail(v) && v.length < 1024,
    isodate: v => isIsoDate(v),
  }
})

const validate = struct({
  id: 'uuid!',
  email: 'email!',
  first: 'name!',
  last: 'name!',
  created_at: 'isodate!',
  is_admin: 'boolean',
})

const data = {
  id: '5a2de30a-a736-5aea-8f7f-ad0f019cdc00',
  email: 'jane@example.com',
  first: 'Jane',
  last: 'Smith',
  created_at: '2017-11-23T00:56:12+00:00',
}

try {
  validate(data)
} catch (e) {
  console.error('User object was invalid!')
  return
}

console.log('User object was valid!')
```


<br/>

### Features

- Uses a simple, SQL-like syntax for building queries.
- Enables dynamic `WHERE`, `ORDER BY`, `INSERT`, `UPDATE`, &hellip; clauses.
- Built on top of [`pg-sql`](https://github.com/calebmer/pg-sql) for writing simple SQL strings in Javascript.
- Compatible with [`pg`](https://github.com/brianc/node-postgres) out of the box.


<br/>

### Why?

Choosing not to use an ORM is a very common and reasonable choice. But one of the biggest downsides is that you lose some of the expressiveness when dynamic SQL statements are concerned. For example when you need to...

- ...insert or update from a handful of different attributes.
- ...filter by custom parameters.
- ...limit, order and paginate with custom parameters.

Building SQL strings by hand for these dynamic inputs is tedious.

There are libraries that try to solve this, but most of them re-invent the entire SQL syntax with Javascript methods—some even require defining your schema in advance. You're basically back to re-inventing an ORM but without any of the benefits.

`pg-sql-helpers` lets you continue to write simple, composable SQL strings with the help of [`pg-sql`](https://github.com/calebmer/pg-sql), while giving you a handful of helper functions to make building queries from dynamic, user-provided values much, much easier.


<br/>

### Types

Out of the box, Superstruct ships with types for each of the built-in Javascript data types, as well as the special `any` type.

- `any`
- `array`
- `boolean`
- `date`
- `function`
- `null`
- `number`
- `object`
- `string`
- `undefined`

The `any` type matches any value that is not explicitly `undefined` (eg. `value !== undefined`).

But you can also define your own domain-specific types that make writing validations for your use case easier and more specific. For example:

```js
import isEmail from 'is-email'
import isIsodate from 'is-isodate'
import { createStruct } from 'superstruct'

const struct = createStruct({
  types: {
    email: v => isEmail(v),
    isodate: v => isIsodate(v),
  }
})

const validate = struct({
  email: 'email!',
  created_at: 'isodate!',
})

validate({
  email: 'sam@example.com',
  created_at: '2017-11-23T00:56:12+00:00',
})
```


<br/>

### API

All of the helpers are exported in lowercase _and_ uppercase, so you can match your existing SQL preferences.

- [`AND`](#and)
- [`INSERT`](#insert)
- [`KEYS`](#keys)
- [`LIMIT`](#limit)
- [`OFFSET`](#offset)
- [`OR`](#or)
- [`ORDER_BY`](#order_by)
- [`SELECT`](#select)
- [`UPDATE`](#update)
- [`VALUES`](#values)
- [`WHERE`](#where)

#### `AND`
`AND([table: String], params: Object)`

```js
sql`
  SELECT *
  FROM users
  WHERE name = 'John'
  ${AND({ age: { gt: 42 }})}
`
```

The same as the [`WHERE`](#where) helper, but the keyword will be `AND` instead. Useful when you've already got a hardcoded `WHERE` you need to augment. The `table` string is optional, but can be passed to qualify the columns to match.

#### `INSERT`
`INSERT(table: String, values: Object|Array<Object>)`

```js
sql`
  ${INSERT('users', { name: 'john', age: 42 })}
  WHERE id = '1'
  RETURNING *
`
```

Create a SQL "INSERT" clause from a set of `values`. Useful when writing dynamic updates based on attributes that may or may not be passed. _In the case of an array of `values`, the keys from the first object in the array will be used._

#### `KEYS`
`KEYS(values: Object|Array<Object>)`

```js
sql`
  SELECT ${KEYS({ name: true, age: true })}
  FROM users
`
```

Extract and join the keys of `values` into a SQL string. Useful for building dynamic clauses like `SELECT`, [`INSERT`](#insert), [`UPDATE`](#update), etc. _In the case of an array of `values`, the keys from the first object in the array will be used._

#### `LIMIT`
`LIMIT(number: Number)`

```js
sql`
  SELECT id, name, age
  FROM users
  ${LIMIT(20)}
`
```

Create a SQL "LIMIT" clause from a dynamic `number`. In the number is `Infinity`, `LIMIT ALL` will be output instead.

#### `OFFSET`
`OFFSET(number: Number)`

```js
sql`
  SELECT id, name, age
  FROM users
  LIMIT 10 ${OFFSET(20)}
`
```

Create a SQL "OFFSET" clause from a dynamic `number`.

#### `OR`
`OR([table: String], params: Object)`

```js
sql`
  SELECT *
  FROM users
  WHERE name = 'John'
  ${OR({ age: { gt: 42 }})}
`
```

The same as the [`WHERE`](#where) helper, but the keyword will be `OR` instead. Useful when you've already got a hardcoded `WHERE` you need to augment. The `table` string is optional, but can be passed to qualify the columns to match.

#### `ORDER_BY`
`ORDER_BY([table: String], params: Array)`

```js
sql`
  SELECT *
  FROM users
  ${ORDER_BY(['name', '-age'])}
`
```

Create a SQL "ORDER BY" clause from an array of `params`. The params are column name identifiers. They default to `ASC NULLS LAST`, but can be prefixed with `'-'` to denote `DESC NULLS LAST`.

#### `SELECT`
`SELECT([table: String], values: Object|Array<Object>|Array<String>)`

```js
sql`
  ${SELECT(['id', 'name'])}
  FROM users
  WHERE id = '1'
`
```

#### `UPDATE`
`UPDATE(table: String, values: Object|Array<Object>)`

```js
sql`
  ${UPDATE('users', { name: 'john', age: 42 })}
  WHERE id = '1'
  RETURNING *
`
```

Create a SQL "UPDATE" clause from a set of `values`. Useful when writing dynamic updates based on attributes that may or may not be passed. _In the case of an array of `values`, the keys from the first object in the array will be used._

#### `VALUES`
`VALUES(values: Object|Array<Object>)`

```js
sql`
  UPDATE users
  SET (name, age) = (${VALUES({ name: 'john', age: 42 })})
`
```

Extract and join the values of `values` into a SQL string. Useful for building dynamic clauses like [`INSERT`](#insert), [`UPDATE`](#update), etc.

#### `WHERE`
`WHERE([table: String], params: Object)`

```js
sql`
  SELECT * 
  FROM users
  ${WHERE({ age: { gte: 42 }})}
`
```

Create a SQL "WHERE" clause from a set of `params`, with optional `table` name string. Useful when writing dynamic filters based on parameters that may or may not be passed. The `table` string is optional, but can be passed to qualify the columns to match.

The parameters are nested objects with modifiers: 

|**Operator**|**SQL**|
|---|---|
|`eq`|`=`|
|`ne`|`!=`|
|`gt`|`>`|
|`gte`|`>=`|
|`lt`|`<`|
|`lte`|`<=`|

If a parameter value is not an object, it will be defaulted to `eq` and compared using `=`.


<br/>

### License

This package is [MIT-licensed](./License.md).
