# Refinements

Superstruct allows you to constrain existing structs with further validation. This doesn't change the type of the struct, but simply introduces extra validation logic. This can be useful for example when ensuring that a string matches a specific `RegExp`.

### `empty`

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
length(string(), 1, 100)

length(array(number), 0, Infinity)
```

```ts
'a string of text'[(1, 2, 3)]
```

`length` enforces that a `string` or `array` struct also is within a certain `min` and `max` length.

### `negative`

```ts
negative(number())
```

```ts
;-42 - 3.14
```

`negative` enforces that a `number` struct is also a negative number (not zero).

### `nonnegative`

```ts
nonnegative(number())
```

```ts
0
42
3.14
```

`nonnegative` enforces that a `number` struct is also a nonnegative number (including zero).

### `nonpositive`

```ts
nonpositive(number())
```

```ts
0 - 42 - 3.14
```

`nonpositive` enforces that a `number` struct is also a nonpositive number (including zero).

### `pattern`

```ts
pattern(string(), /\d+/)
```

```ts
'123'
```

`pattern` enforces that a `string` struct also matches a supplied `RegExp`.

### `positive`

```ts
positive(number())
```

```ts
42
3.14
```

`positive` enforces that a `number` struct is also a positive number (not zero).

### Custom Refinements

You can also define your own custom refinments that are specific to your application's requirements, like so:

```ts
const PositiveInteger = refinement(number(), 'PositiveInteger', (value) => {
  return Number.isInteger(value) && value >= 0
})
```

This allows you to define more fine-grained runtime validation, while still preserving the `number` type at compile time.
