# Refinements

Superstruct allows you to constrain existing structs with further validation. This doesn't change the type of the struct, but simply introduces extra validation logic. This can be useful for example when ensuring that a string matches a specific `RegExp`.

### `above`

```ts
above(number(), 9000)
```

```ts
9001
```

`above` enforces that a `number` struct is above (greater than) a threshold.

### `below`

```ts
below(number(), 0)
```

```txt
-1
```

`below` enforces that a `number` struct is below (less than) a threshold.

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
size(array(number), 0)
size(number(), 93, Infinity)
```

```txt
'a string of text'
[1, 2, 3]
Infinity
```

`size` enforces that a `number`, `string`, `array`, `map`, or `set` struct also is within a certain `min` and `max` size (or length).

> 🤖 The `max` argument is optional and defaults to whatever you pass for `min`, which makes specifying exact sizes easy (just omit the max).

### Custom Refinements

You can also define your own custom refinments that are specific to your application's requirements, like so:

```ts
import { number, refine } from 'superstruct'

const PositiveInteger = refine(number(), 'PositiveInteger', (value) => {
  return Number.isInteger(value) && value >= 0
})
```

This allows you to define more fine-grained runtime validation, while still preserving the `number` type at compile time.
