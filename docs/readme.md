Superstruct makes it easy to define interfaces and then validate JavaScript data against them. Its type annotation API was inspired by [Typescript](https://www.typescriptlang.org/docs/handbook/basic-types.html), [Flow](https://flow.org/en/docs/types/), [Go](https://gobyexample.com/structs), and [GraphQL](http://graphql.org/learn/schema/), giving it a familiar and easy to understand API.

But Superstruct is designed for validating data at runtime, so it throws (or returns) detailed runtime errors for you or your end users. This is especially useful in situations like accepting arbitrary input in a REST or GraphQL API. But it can even be used to validate internal data structures at runtime when needed.

<br/>

### Usage

Superstruct allows you to define the shape of data you want to validate:

```js
import { assert, object, number, string, array } from 'superstruct'

const Article = object({
  id: number(),
  title: string(),
  tags: array(string()),
  author: object({
    id: number(),
  }),
})

const data = {
  id: 34,
  title: 'Hello World',
  tags: ['news', 'features'],
  author: {
    id: 1,
  },
}

assert(data, Article)
// This will throw an error when the data is invalid.
// If you'd rather not throw, you can use `is()` or `validate()`.
```

Superstruct ships with validators for all the common JavaScript data types, and you can define custom ones too:

```js
import { is, struct, object, string } from 'superstruct'
import isUuid from 'is-uuid'
import isEmail from 'is-email'

const Email = struct('Email', isEmail)
const Uuid = struct('Uuid', isUuid.v4)

const User = object({
  id: Uuid,
  email: Email,
  name: string(),
})

const data = {
  id: 'c8d63140-a1f7-45e0-bfc6-df72973fea86',
  email: 'jane@example.com',
  name: 'Jane',
}

if (is(data, User)) {
  // Your data is guaranteed to be valid in this block.
}
```

Superstruct can also handle coercion of your data before validating it, for example to mix in default values:

```ts
import { create, object, number, string, defaulted } from 'superstruct'

const User = object({
  id: defaulted(number(), () => i++),
  name: string(),
})

const data = {
  name: 'Jane',
}

// You can apply the defaults to your data while validating.
const user = create(data, User)
// {
//   id: 1,
//   name: 'Jane',
// }
```

And if you use TypeScript, Superstruct automatically ensures that your data has proper typings whenever you validate it:

```ts
import { is, object, number, string } from 'superstruct'

const User = object({
  id: number(),
  name: string()
})

const data: unknown = { ... }

if (is(data, User)) {
  // TypeScript knows the shape of `data` here, so it is safe to access
  // properties like `data.id` and `data.name`.
}
```

Superstruct supports more complex use cases too like defining arrays or nested objects, composing structs inside each other, returning errors instead of throwing them, and more!
