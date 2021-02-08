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

### `trimmed`

```ts
trimmed(string())
```

`trimmed` arguments a struct to ensure that any string input values are trimmed.

### Custom Coercions

You can also define your own custom coercions that are specific to your application's requirements, like so:

```ts
import { coerce, number, string, create } from 'superstruct'

const MyNumber = coerce(number(), string(), (value) => parseFloat(value))

const a = create(42, MyNumber) // 42
const b = create('42', MyNumber) // 42
const c = create(false, MyNumber) // error thrown!
```

The second argument to `coerce` is a struct narrowing the types of input values you want to try coercion. In the example above, the coercion functionn will only ever be called when the input is a string—booleans would ignore coercion and fail normally.

> 🤖 If you want to run coercion for any type of input, use the `unknown()` struct to run it in all cases.
