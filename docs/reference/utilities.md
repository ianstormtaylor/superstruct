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

`assign` creates a new struct by mixing the properties of existing object structs, similar to JavaScript's native [`Object.assign`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign). It can accept `object` and `type` structs, returning a struct matching whichever is passed in as the first parameter (ie, which struct is being "assigned" into).

### `deprecated`

```ts
object({
  id: number(),
  full_name: string(),
  name: deprecated(string(), (value, ctx) => {
    console.warn(`${ctx.path} is deprecated, but value was '${value}'. Please use 'full_name' instead.`)
  }),
})
```

```ts
{ id: 1, name: 'Jane' }
```

`deprecated` structs validate that a value matches a specific struct, or that it is `undefined`. But in addition, when the value is not `undefined`, it will call the `log` function you pass in so you can warn users that they're using a deprecated API.

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
