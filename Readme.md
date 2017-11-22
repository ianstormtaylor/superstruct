
# pg-sql-helpers

A set helpers for writing dynamic SQL queries with [`pg-sql`](https://github.com/calebmer/pg-sql) in Javascript.

_It's sort of like a [`lodash`](https://lodash.com/) or [`polished`](https://polished.js.org/) for writing SQL._

---

### Features

- Uses a simple, SQL-like syntax for building queries.
- Enables dynamic `WHERE`, `ORDER BY`, `INSERT`, `UPDATE`, &hellip; clauses.
- Built on top of [`pg-sql`](https://github.com/calebmer/pg-sql) for writing simple SQL strings in Javascript.
- Compatible with [`pg`](https://github.com/brianc/node-postgres) out of the box.

---

### Example

Out of the box, [`pg-sql`](https://github.com/calebmer/pg-sql) lets you write SQL just like you're used to:

```js
import { sql } from 'pg-sql'

const name = 'john'
const result = await pg.query(sql`
  SELECT id, name, age
  FROM users
  WHERE name = ${name}
`)
```

With `pg-sql-helpers` you can use the same SQL-like syntax when writing queries with dynamic clauses, like:

```js
import { sql } from 'pg-sql'
import { INSERT, ORDER_BY, WHERE } from 'pg-sql-helpers'

const filter = { name: 'john', age: { gt: 42 }}
const result = await pg.query(sql`
  SELECT id, name, age
  FROM users
  ${WHERE(filter)}
`)

const attrs = { name: 'jane', age: 42 }
const result = await pg.query(sql`
  ${INSERT('users', attrs)}
  RETURNING *
`)

const sort = ['name', '-age']
const result = await pg.query(sql`
  SELECT id, name, age
  FROM users
  ${ORDER_BY(sort)}
`)
```

So that when building APIs that allow dynamic user input (eg. inserts, updates, filters, sorting, pagination, etc.) you can write powerful queries without concatenating strings or doing other confusing things.

---

### Why?

Choosing not to use an ORM is a very common and reasonable choice. But one of the biggest downsides is that you lose some of the expressiveness when dynamic SQL statements are concerned. For example when you need to...

- ...insert or update from a handful of different attributes.
- ...filter by custom parameters.
- ...limit, order and paginate with custom parameters.

Building SQL strings by hand for these dynamic inputs is tedious.

There are libraries that try to solve this, but most of them re-invent the entire SQL syntax with Javascript methods—some even require defining your schema in advance. You're basically back to re-inventing an ORM but without any of the benefits.

`pg-sql-helpers` lets you continue to write simple, composable SQL strings with the help of [`pg-sql`](https://github.com/calebmer/pg-sql), while giving you a handful of helper functions to make building queries from dynamic, user-provided values much, much easier.

---

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

---

### License

This package is [MIT-licensed](./License.md).
