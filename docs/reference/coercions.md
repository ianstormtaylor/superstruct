# Coercions

Superstruct allows structs to be augmented with coercion logic, allowing you to transform input data before validating it. This is most commonly used to apply default values to an input, but it can be used for more complex cases like pre-trimming strings, or pre-parsing inputs.

### `defaulted`

```ts
defaulted(string(), 'Untitled')

object({
  id: defaulted(number(), () => i++),
  name: string(),
  role: defaulted(enums(['admin', 'member', 'guest']), 'guest'),
})
```

`defaulted` augments a struct to add coercion logic for default values, which are applied when the input is `undefined`.

> 🤖 If you add `defaulted` to an `object` struct with a dictionary of values, those values will be mixed in one-by-one, so the input doesn't need to be `undefined`, but certain properties can be `undefined`.

### `masked`

```ts
masked(
  object({
    name: string(),
  })
)
```

`masked` augments an object struct to strip any unknown properties from the input when coercing it.

### Custom Coercions

You can also define your own custom coercions that are specific to your application's requirements, like so:

```ts
import { coerce, string } from 'superstruct'

const PositiveInteger = coerce(string(), (value) => {
  return typeof value === 'string' ? value.trim() : value
})
```

This allows you to customize how lenient you want to be in accepting data with your structs.

> 🤖 Note that the `value` argument passed to coercion handlers is of type `unknown`! This is because it has yet to be validated, so it could still be anything. Make sure your coercion functions guard against unknown types.
