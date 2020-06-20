# Getting Started

- [Getting Started](#getting-started)
  - [Installing Superstruct](#installing-superstruct)
  - [Creating Structs](#creating-structs)
  - [Making Values Optional](#making-values-optional)
  - [Setting Default Values](#setting-default-values)
  - [Defining Custom Data Types](#defining-custom-data-types)
  - [Throwing Customized Errors](#throwing-customized-errors)
  - [Validating Complex Shapes](#validating-complex-shapes)
  - [Composing Structs](#composing-structs)
  - [Refining Types](#refining-types)
  - [Coercing Values](#coercing-values)
  - [Using TypeScript](#using-typescript)

## Installing Superstruct

To install Superstruct with Yarn or Npm, simply:

```bash
yarn add superstruct
```

```bash
npm install --save superstruct
```

And then you can import it into your code base:

```ts
import { assert } from 'superstruct'
```

Superstruct has many importable methods. To reduce the friction of importing many methods you can use a wildcard. The methods are then accessed from one object.

```ts
import * as s from 'superstruct'

const User = s.object({
  id: s.number(),
  name: s.string(),
})
```

If you would rather import Superstruct with a `<script>` tag, you can use the bundled build:

```html
<script src="https://unpkg.com/superstruct/umd/superstruct.min.js"></script>
```

This will expose the `Superstruct` global with the exported functions.

## Creating Structs

Once you've got Superstruct installed, the next step is to create a struct for some data you want validate. In our case, lets start with data describing a user:

```ts
const data = {
  id: 42,
  name: 'Jane Smith',
  email: 'jane@example.com',
}
```

We'll import Superstruct and create a struct with it:

```ts
import { object, number, string } from 'superstruct'

const User = object({
  id: number(),
  name: string(),
  email: string(),
})
```

Now we can use our `User` struct to validate the data. The easiest way to do this is to use the `assert` helper, like so:

```ts
import { assert } from 'superstruct'

assert(data, User)
```

This will throw an error if the data is invalid. In this case, the data is valid, so no error is thrown.

But what if we pass it an invalid user object, where the name is not a string:

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

An error was thrown! That's what we expected.

If you'd rather have the error returned instead of thrown, you can use the `validate` helper. Or, if you'd just like receive a boolean of whether the data is valid or not, use the `is` helper.

> 🤖 Check out the [Validation reference](https://superstructjs.org/interfaces/struct) for more information.

## Making Values Optional

What about when you have a property like `is_admin` that only appears on a few special users? In that case you can make certain properties optional, like so:

```ts
import { optional } from 'superstruct'

const User = object({
  id: number(),
  name: string(),
  email: string(),
  is_admin: optional(boolean()),
})
```

Wrapping a struct in `optional` means that the value can also be `undefined` and it will still be considered valid.

So now both of these pieces of data would be valid:

```ts
const jane = {
  id: 43,
  name: 'Jane Smith',
  email: 'jane@example.com',
  is_admin: true,
})

const jack = {
  id: 44,
  name: 'Jack Smith',
  email: 'jack@example.com',
})
```

## Setting Default Values

In the case of optional values, you might also want to define a default value for a property if the input is `undefined`. This is helpful for data consistency. For example, you can make the new `is_admin` property default to `false`.

To allow for these use cases, Superstruct has a concept called "coercion", which allows you to encode specific logic about how to transform a piece of data before validating it.

To apply default values, you can use the `defaulted` coercion:

```ts
import { defaulted } from 'superstruct'

const User = defaulted(
  object({
    id: number(),
    name: string(),
    email: string(),
    is_admin: optional(boolean()),
  }),
  {
    is_admin: false,
  }
)
```

To receive the data with the defaults applied, you'll need to use `coerce` to retrieve the coerced value:

```ts
import { coerce } from 'superstruct'

const data = {
  id: 43,
  name: 'Jane Smith',
  email: 'jane@example.com',
}

const user = coerce(data, User)
// {
//   id: '43',
//   name: 'Jane Smith',
//   email: 'jane@example.com',
//   is_admin: false,
// }
```

The original `data` did not define an `is_admin` property, but after running the struct's coercion logic the default was applied. If the value had been invalid, an error would have been thrown.

## Defining Custom Data Types

Next up, you might have been wondering about the `email` property. So far we've just defined it as a string, which means that any old string will pass validation.

But we'd really like to validate that the email is a valid email address.

To define custom data types, we can use the [`struct`](https://superstructjs.org/interfaces/superstruct) factory...

```ts
import { struct } from 'superstruct'
import isEmail from 'is-email'

const Email = struct('Email', (value) => isEmail(value))
```

Now we can define structs know about the `'email'` type:

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

assert(data, User)
// StructError: 'Expected a value of type "Email" for `email` but received `'jane'`.' {
//   type: 'email',
//   value: 'jane',
//   path: ['email'],
//   branch: [{...}, 'jane'],
//   failures: [...]
// }
```

And there you have it!

> 🤖 For the full list of built-in data types, check out the [Types reference](https://superstructjs.org/#types).

## Throwing Customized Errors

Finally, although the errors Superstruct throws are very descriptive, and developer readable, they're not really domain-specific. If you're building a REST or GraphQL API, you probably want to customize your errors to be specific to your application, and to follow a spec.

Doing that with Superstruct is easy. Just `try/catch` the errors like usual, and then use the exposed information to build your own errors.

For example, lets throw a `'user_email_invalid'` error using the `User` struct from above...

```ts
router.post('/users', ({ request, response }) => {
  const data = request.body

  try {
    assert(data, User)
  } catch (e) {
    const { path, value, type } = e
    const key = path[0]

    if (value === undefined) {
      const error = new Error(`user_${key}_required`)
      error.attribute = key
      throw error
    } else if (type === 'never') {
      const error = new Error(`user_attribute_unknown`)
      error.attribute = key
      throw error
    } else {
      const error = new Error(`user_${key}_invalid`)
      error.attribute = key
      error.value = value
      throw error
    }
  }
})
```

Now all of your user validation errors are standardized, so you end up with errors with codes like:

```
user_email_invalid
user_email_required
user_email_unknown

user_name_invalid
user_name_required
...
```

Although this example is simplified, the struct errors expose all of the possible information about why the validation failed, so you can use them to construct extremely detailed errors for your end users.

> To see all of the information embedded in `StructError` objects, check out the [`StructError` reference](https://superstructjs.org/classes/structerror).

## Validating Complex Shapes

In the most common uses, you'll be modeling your data using `object` structs at the top level. However, there are more structures of data you might like to validate that simple objects with key/values.

Superstruct makes it easy to validate things like tuples, enums, dictionaries, lists, unions, literals, etc.

For example, say you wanted to validate coordinate tuples:

```ts
import { tuple } from 'superstruct'

const Coordinates = tuple([number(), number()])
const data = [0, 3]
assert(data, Coordinates)
```

Or, you might want to validate that one of the properties of your user objects is an enum of a particular set of values:

```ts
import { enums } from 'superstruct'

const User = object({
  id: number(),
  name: string(),
  role: enums(['collaborator', 'owner', 'admin']),
})
```

All of this can be achieved using the helpers that ship with Superstruct by default.

> 🤖 For a full list of the kinds of structs you can create, check out the [Superstruct reference](https://superstructjs.org/interfaces/superstruct).

## Composing Structs

Sometimes you want to break validations down into components, and compose them together to validate more complex objects. Superstruct makes this easy by allowing an existing struct to be passed in as a schema. For example:

```ts
const User = struct({
  id: number(),
  name: string(),
})

const Article = struct({
  id: number(),
  title: string(),
  author: User,
})
```

## Refining Types

There are some cases where you want to create a validation that is more fine-grained than a "type". For example, you might want not just a `string`, but a specific format of string. Or not just a `User`, but a user that is also an administrator.

For these situations, you can use refinements. They allow you to create a new struct that is derived from an exsisting struct with an extra bit of validation layered on top.

For example, for a specific kind of string:

```ts
import { refinement } from 'superstruct'

const MyString = refinement(string(), value => {
  return value.startsWith('The') && value.length > 20)
})
```

Now the `MyString` will only validate strings that begin with "The" and are longer than 20 characters.

## Coercing Values

We've already covered default values, but sometimes you'll need to create coercions that aren't just defaulted `undefined` values, but instead transforming the input data from one format to another.

For example, maybe you want to ensure that any string is trimmed before passing it into the validator:

```ts
import { coercion } from 'superstruct'

const TrimmedString = coercion(string, (value) => {
  return typeof value === 'string' ? value.trim() : value
})
```

Now before using `assert()` or `is()` you can use `coerce()` to apply your custom coercion logic:

```ts
import { coerce } from 'superstruct'

const data = '  a wEird str1ng        '
const output = coerce(data, TrimmedString)
// "a wEird str1ng"
```

## Using TypeScript

Most of the time, TypeScript "just works" but knowing a little more will help you get the most out of TypeScript.

## Custom Data Types

When you define a custom type, it is returned as `unknown` by default. In order to get better typing, you can use a generic to specify the type.

The following defines a custom email type and adds a generic to declare the value is of type `string`.

```ts
import { struct } from 'superstruct'
import isEmail from 'is-email'

const Email = struct<string>('Email', (value) => isEmail(value))
```

## Extracting a Type

If you have a struct definition, you can extract its type using the `StructType` utility.

```ts
const User = object({
  id: number(),
  name: string(),
})

type User = StructType<typeof User>
// type User = {
//   id: number
//   name: string
// }
```
