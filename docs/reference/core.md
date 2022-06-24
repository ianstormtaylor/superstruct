# Core

### `assert`

`assert<T>(value: unknown, struct: Struct<T>) => asserts value is T`

```ts
assert(value, User)
```

Assert that `value` is valid according to a `struct`. If the value is invalid a [`StructError`](./errors.md#structerror) will be thrown.

> 🤖 When using TypeScript `assert` acts as an [assertion function](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions), so you can ensure that after calling it the type of the `value` matches the shape of the struct.

### `create`

`create<T>(value: unknown, struct: Struct<T>) => T`

```ts
const user = create(value, User)
```

Create a `value` using the coercion logic that is built-in to the struct, returning the newly coerced value. If the value is invalid a [`StructError`](./errors.md#structerror) will be thrown.

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

### `mask`

`mask<T>(value: unknown, struct: Struct<T>) => T`

```ts
const user = mask(value, User)
```

Mask a `value`, returning a new value containing only properties defined by a `struct`. Conceptually this is similar to `create`, except that extra properties are omitted from the newly created value instead of throwing a [`StructError`](./errors.md#structerror).

Note that when `mask` is used with `type` — given that `type` signals to the core that an object might have arbitrary additional properties — unknown properties will be retained in the returned value.

> 🤖 Just like `create`, `mask` includes coercion logic and works recursively.


### `validate`

`validate<T>(value: unknown, struct: Struct<T>, options: Object) => [StructError, T]`

```ts
const [err, user] = validate(value, User)
```

Validate `value`, returning a result tuple. If the value is invalid the first element will be a [`StructError`](./errors.md#structerror). Otherwise, the first element will be `undefined` and the second element will be a value that is guaranteed to match the struct.

You can pass `{ coerce: true }` as the third argument to enable coercion of the input value.
