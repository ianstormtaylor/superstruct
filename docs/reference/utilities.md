# Utilities

Superstruct also ships with a handful of utility type factories, which allow you to easily manipulate and transforms existing structs.

### `assign`

```ts
assign(object({ id: string() }), object({ name: string() }))
```

```ts
{
  id: 1,
  name: 'Jane',
}
```

`assign` creates a new struct by mixing the properties of existing object structs, similar to JavaScript's native [`Object.assign`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign).

### `dynamic`

```ts
const User = object({ ... })
const Bot = object({ ... })

dynamic((value) => {
  value.kind === 'user' ? User : Bot
})
```

`dynamic` allows you to create a struct with validation logic that can change at runtime. The callback will be called with `(value, context)` and must return the struct to continue validation with.

### `lazy`

```ts
const Node = object({
  id: number(),
  children: lazy(() => array(Node)),
})
```

`lazy` allows you to create a self-referential struct, useful for defining recursive data structures.

> 🤖 Note that TypeScript can't automatically infer the type from this kind of recursive structure, so you'll need to pass in the type manually.

### `omit`

```ts
omit(
  object({
    id: number(),
    name: string(),
  }),
  ['name']
)
```

`omit` allows you to create a new struct based on an existing object struct, but excluding specific properties.

### `partial`

```ts
partial(
  object({
    id: number(),
    name: string(),
  })
)
```

```ts
{ id: 1, name: 'Jane' }
{ id: 1 }
{ name: 'Jane' }
```

`partial` allows you to create a new struct based on an existing object struct, but with all of its properties being optional.

### `pick`

```ts
pick(
  object({
    id: number(),
    name: string(),
  }),
  ['id']
)
```

`pick` allows you to create a new struct based on an existing object struct, but only including specific properties.
