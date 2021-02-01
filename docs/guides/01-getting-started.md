# Getting Started

## Installing Superstruct

To install Superstruct with Yarn or Npm, either:

```bash
yarn add superstruct
npm install --save superstruct
```

And then you can import it:

```ts
import { object, string, number } from 'superstruct'

const User = object({
  id: number(),
  name: string(),
})
```

If you'd like, you can use a wildcard import:

```ts
import * as s from 'superstruct'

const User = s.object({
  id: s.number(),
  name: s.string(),
})
```

If you'd rather use a `<script>` tag, you can use the UMD build:

```html
<script src="https://unpkg.com/superstruct/umd/superstruct.min.js"></script>
```

This will expose the `Superstruct` global.

## Defining Structs

Once you've got Superstruct installed, the next step is to create a "struct" for some data you want validate. Each struct corresponds to a specific type of data. In our case, lets start with data describing a user:

```ts
const data = {
  id: 42,
  name: 'Jane Smith',
  email: 'jane@example.com',
}
```

We'll import Superstruct and create an object-shaped struct with it:

```ts
import { object, number, string } from 'superstruct'

const User = object({
  id: number(),
  name: string(),
  email: string(),
})
```

This `User` struct will expect an object with an `id` property that is a number, and `name` and `email` properties that are strings.

Now we can use our `User` struct to validate the data. The easiest way to do this is to use the [`assert`](../reference/core.md#assert) helper, like so:

```ts
import { assert } from 'superstruct'

assert(data, User)
```

This will throw an error if the data is invalid. In this case, the data is valid, so no error is thrown.

But if we pass it invalid data, it will throw an error:

```ts
const data = {
  id: 43,
  name: false,
  email: 'jane@example.com',
}

assert(data, User)
// StructError: 'Expected a value of type "string" for `name` but received `false`.' {
//   type: 'string',
//   value: false,
//   branch: [{ ... }, false],
//   path: ['name'],
//   failures: [...],
// }
```

If you'd rather have the error returned instead of thrown, you can use the [`validate`](../reference/core.md#validate) helper. Or, if you'd just like receive a boolean of whether the data is valid or not, use the [`is`](../reference/core.md#is) helper.
