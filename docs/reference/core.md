# Core

### `assert`

`assert<T>(value: unknown, struct: Struct<T>) => asserts value is T`

```ts
assert(value, User)
```

Assert that `value` is valid according to a `struct`. If the value is invalid a [`StructError`](./errors.md#structerror) will be thrown.

> 🤖 When using TypeScript `is` acts as an assertion guard, so you can ensure that after calling it the `value` matches the shape of the struct.

### `coerce`

`coerce<T>(value: unknown, struct: Struct<T>) => unknown`

```ts
const user = assert(value, User)
```

Coerce a `value` using the coercion logic that is built-in to the struct, returning the newly coerced value.

> 🤖 If you want coercion logic like defaulted values, you **must** call this helper before running validation.

### `is`

`is<T>(value: unknown, struct: Struct<T>) => value is T`

```ts
if (is(value, User)) {
  // ...
}
```

Test that `value` is valid, returning a boolean representing whether it is valid or not.

> 🤖 When using TypeScript `is` acts as a type guard, so you can use it in an `if` statement to ensure that inside the statement the `value` matches the shape of the struct.

### `validate`

`validate<T>(value: unknown, struct: Struct<T>) => [StructError, T]`

```ts
const [err, user] = validate(value, User)
```

Validate `value`, returning a result tuple. If the value is invalid the first element will be a [`StructError`](./errors.md#structerror). Otherwise, the first element will be `undefined` and the second element will be a value that is guaranteed to match the struct.
