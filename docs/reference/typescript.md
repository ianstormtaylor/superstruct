# TypeScript

Superstruct is designed with TypeScript in mind, so that you don't need to duplicate type definitions.

## Utilities

### `Describe`

The `Describe` utility returns a type representing a struct for a given valid value type. This allows you to ensure you're writing your struct definitions properly, for example:

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

> 🤖 There are limitations to what `Describe` can do, specifically it will always assume object types are as strict as possible. So describing the `type()` struct is not possible, and simple unions of strings will be required to use `enums()`.

### `Infer`

The `Infer` utility type extracts the type of a valid value from a struct definition. This allows you to avoid having to duplicate effort when writing typings, for example:

```ts
const User = object({
  id: number(),
  name: string(),
})

type User = Infer<typeof User>
// type User = {
//   id: number
//   name: string
// }
```

> 🤖 If you are not using TypeScript's [`strictNullChecks`](https://www.typescriptlang.org/tsconfig#strictNullChecks) option, Superstruct will be unable to infer your "optional" types correctly and will mark all types as optional.
