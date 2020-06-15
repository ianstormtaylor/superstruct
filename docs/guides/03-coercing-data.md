# Coercing Data

Sometimes while validating input data you'll actually want to "coerce" it to change it in someway to help validation pass. The most common example of this is adding default values to properties, but it can also be used to parse multiple input formats, or cleanup inconsistent data.

To allow for these use cases, Superstruct has a concept called "coercion", which allows you to encode specific logic about how to transform a piece of data before validating it.

## Default Values

Since defaults are such a common case, Superstruct comes with a `defaulted` helper that makes defining default values easy:

```ts
import { defaulted, coerce } from 'superstruct'

let i = 0

const User = object({
  id: defaulted(number(), () => i++),
  email: string(),
  name: string(),
})

const data = {
  name: 'Jane',
  email: 'jane@example.com',
}

const user = coerce(data, User)
```

Here the `user` object didn't default an `id` property. That's because any `undefined` values will be replaced with their default values instead.

Notice that we used [`coerce`](../reference.md#coerce) and not [`assert`](../reference.md#assert)! This is an important distinction because we want to receive the return value of the newly coerced data.

The `defaults` helper also works with objects:

```ts
const User = defaulted(
  object({
    id: number(),
    name: string(),
    email: string(),
  }),
  {
    id: () => i++,
  }
)
```

## Custom Coercions

We've already covered default values, but sometimes you'll need to create coercions that aren't just defaulted `undefined` values, but instead transforming the input data from one format to another.

For example, maybe you want to ensure that any string is trimmed before passing it into the validator. To do that you can define a custom coercion:

```ts
import { coercion } from 'superstruct'

const TrimmedString = coercion(string(), (value) => {
  return typeof value === 'string' ? value.trim() : value
})
```

Now instead of using `assert()` or `is()` you can use `coerce()` to apply your custom coercion logic:

```ts
import { coerce } from 'superstruct'

const data = '  a wEird str1ng        '
const output = coerce(data, TrimmedString)
// "a wEird str1ng"
```

If the input data had been invalid or unable to be coerced an error would have been thrown instead.
