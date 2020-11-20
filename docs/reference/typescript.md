# TypeScript

Superstruct is designed with TypeScript in mind, so that you don't need to duplicate type definitions.

## Utilities

### `Infer`

You can use the `Infer` utility type to infer the valid value of a struct definition. This allows you to avoid having to duplicate effort when writing typings.

For example:

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
