# Using TypeScript

Superstruct is built with TypeScript, and is designed to integrate seamlessly with its guards and assertions. Which means that if you're using TypeScript too you'll get compile-time typings for your data.

> 🤖 Warning: If you are not using TypeScript's [`strictNullChecks`](https://www.typescriptlang.org/tsconfig#strictNullChecks) option, Superstruct will be unable to infer your "optional" types correctly and will mark all types as optional.

## Narrowing Types

Whenever you use the `is` or `assert` helpers in Superstruct, TypeScript will infer information about your data and give you type safety. For example:

```ts
const User = object({
  id: number(),
  email: email(),
  name: string(),
})

if (is(data, User)) {
  // In this block TypeScript knows the shape of `data` is guaranteed to match
  // the `User` struct, so you can access properties like `data.name`.
}
```

Inside that `if` block you can safely access the `User` properties `id`, `name` and `email` because TypeScript knows that the data already passed validation.

The same for goes assertions:

```ts
assert(data, User)
// After this point TypeScript knows that data is valid too!
```

This makes it a lot easier to deal with inputs because you don't need to manually guard and refine their types.

## Describing Types

You can ensure that you're properly describing your existing TypeScript types with Superstruct by using the `Describe` utility. For example:

```ts
type User = {
  id: number
  name: string
}

const User: Describe<User> = object({
  id: string(), // This mistake will fail to pass type checking!
  name: string(),
})
```

In this case, the incorrectly defined `id` property will cause TypeScript's compilation checks to throw an error. This way your compile-time and run-time validations are never out of sync.

## Inferring Types

You can also do the reverse and infer a TypeScript type using an existing Superstruct struct with the `Infer` utility. For example:

```ts
import { Infer } from 'superstruct'

const User = object({
  id: number(),
  email: email(),
  name: string(),
})

type User = Infer<typeof User>
```

The `User` type above is the same as if you'd defined it by hand:

```ts
type User = {
  id: number
  email: string
  name: string
}
```

This saves you from having to duplicate definitions.

> 🤖 Notice that in each of the cases above, the `User` type and the `User` struct have the same name! This is handy for importing them elsewhere in the codebase at the same time.
