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

`empty` enforces that a `string`, `array`, `map`, or `set` is empty.

> 🤖 Technically this is the same as using [`size`](#size) of zero, but "empty" feels slightly nicer and will give a slightly easier to read error.

### `max`

```ts
max(number(), 0)
```

```txt
-1
```

`max` enforces that a `number` struct is less than a threshold.

> 🤖 If you need an exclusive maxmimum you can pass `{ exclusive: true }` as the third argument, like `max(number(), 0, { exclusive: true })` for negative numbers.

### `min`

```ts
min(number(), 9000)
```

```ts
9001
```

`min` enforces that a `number` struct is greater than a threshold.

> 🤖 If you need an exclusive minimum you can pass `{ exclusive: true }` as the third argument, like `min(number(), 0, { exclusive: true })` for positive numbers.

### `nonempty`

```ts
nonempty(string())
nonempty(array())
```

`nonempty` enforces that a string, array, map, or set is not empty. This does the opposite of `empty`.

### `pattern`

```ts
pattern(string(), /\d+/)
```

```ts
'123'
```

`pattern` enforces that a `string` struct also matches a supplied `RegExp`.

### `size`

```ts
size(string(), 1, 100)
size(array(number()), 0)
size(number(), 93, Infinity)
```

```txt
'a string of text'
[]
Infinity
```

`size` enforces that a `number`, `string`, `array`, `map`, or `set` struct also is within a certain `min` and `max` size (or length).

> 🤖 The `max` argument is optional and defaults to whatever you pass for `min`, which makes specifying exact sizes easy (just omit the max).

### Custom Refinements

You can also define your own custom refinments that are specific to your application's requirements, like so:

```ts
import { number, refine } from 'superstruct'

const Positive = refine(number(), 'positive', (value) => value >= 0)
```

This allows you to define more fine-grained runtime validation, while still preserving the `number` type at compile time.
