# Validating Data

Superstruct is designed to let you validate any data, ensuring that it matches a specific schema. In this guide we'll show you some of the possibilities.

## Primitive Values

The simplest structs are ones that validate "primitive" values, like strings, numbers or booleans. For example:

```ts
import { string } from 'superstruct'

const Struct = string()

assert('a string', Struct) // passes
assert(42, Struct) // throws!
```

In this case, `assert` will throw an error if the input `data` is not a a string. So on any line after the assertion we're guaranteed to be dealing with a string input.

> 🤖 Note: Superstruct works well with TypeScript guards and assertions, so after calling `assert` or `is` you can access your data in a type-safe way!

But Superstruct has simple structs like these for more than the primitive types. It has support out of the box for many of the common types you might need to validate—dates, functions, regexps, etc.

```ts
import { date } from 'superstruct'

const Struct = date()

assert(new Date(), Struct) // passes
assert('a string', Struct) // throws!
```

Here we're ensuring that `data` is a valid `Date` object.

> 🤖 Check out the [Types reference](../reference/types.md) for all of the possible struct types.

## Composed Values

In addition to simple, "flat" values, you can also compose structs into more complex shapes. The most common example of this is `object` structs:

```ts
const User = object({
  id: number(),
  email: string(),
  name: string(),
})

// passes
assert(
  {
    id: 1,
    email: 'jane@example.com',
    name: 'Jane',
  },
  User
)

// throws! (id is invalid)
assert(
  {
    id: '1',
    email: 'jane@example.com',
    name: 'Jane',
  },
  User
)

// also throws! (email is missing)
assert(
  {
    id: 1,
    name: 'Jane',
  },
  User
)
```

This `User` struct will ensure that input data is an object with specific shape of properties, and with property values that match structs.

You could also define a struct which represents a list of values that all match a specific type, using the `array` factory. For example:

```ts
import { array } from 'superstruct'

const Struct = array(number())

assert([1, 2, 3], Struct) // passes!
assert(false, Struct) // throws!
assert(['a', 'b', 'c'], Struct) // throws! (invalid element)
```

These are only two examples, but Superstruct supports many complex structs—maps, sets, records, tuples, etc.

You can also compose structs together, for cases where you have relationships between pieces of data. For example, a `User` and a `Team`:

```ts
const User = object({
  id: number(),
  email: string(),
  name: string(),
})

const Team = object({
  id: number(),
  name: string(),
  users: array(User),
})
```

> 🤖 For modelling recursive structures you can use the [`lazy`](../reference/types.md#lazy) utility to prevent circular errors.

## Optional Values

You can also model optional properties. For example, maybe an `email` address isn't strictly required for all your users, you could do:

```ts
import { optional } from 'superstruct'

const User = object({
  id: number(),
  name: string(),
  email: optional(string()),
})
```

Wrapping a struct in `optional` means that the value can also be `undefined` and it will still be considered valid.

So now both of these pieces of data would be valid:

```ts
const jane = {
  id: 43,
  name: 'Jane Smith',
  email: 'jane@example.com',
}

const jack = {
  id: 44,
  name: 'Jack Smith',
}
```

Similarly to `optional`, you can use `nullable` for properties that can also be `null` values. For example:

```ts
const Article = object({
  title: string(),
  body: string(),
  published_at: nullable(date()),
})
```

> 🤖 Check out the [Types reference](../reference/types.md) for all of the possible struct types.

## Custom Values

Next up, you might have been wondering about the `email` property. So far we've just defined it as a string, which means that any old string will pass validation.

But we'd really like to validate that the email is a valid email address. You can do this by defining a custom validation struct:

```ts
import { define } from 'superstruct'
import isEmail from 'is-email'

const email = () => define('email', (value) => isEmail(value))
```

Now we can define structs know about the `email` type:

```ts
const User = object({
  id: number(),
  name: string(),
  email: email(),
  is_admin: optional(boolean()),
})
```

Now if you pass in an email string that is invalid, it will throw:

```ts
const data = {
  id: 43,
  name: 'Jane Smith',
  email: 'jane',
}

assert(data, User) // throws! (invalid email)
```

And there you have it!

> 🤖 Check out the [Types reference](../reference/types.md) for all of the possible struct types.
