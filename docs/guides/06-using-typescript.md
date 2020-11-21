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

## Inferring Types

You can also do the reverse and infer a TypeScript type using an existing Superstruct struct. For example:

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

This save you from having to duplicate definitions.

Since types and values are allowed to shadow each other in TypeScript, a common way to write the above is to have both the struct and the type use the same name. That way, your calling code can import both at once:

```ts
import { User } from './user'

function save(user: User) {
  // Some saving logic here!
}

router.post('/users', ({ request, response }) => {
  const data = request.body
  assert(data, User)
  save(user)
})
```
