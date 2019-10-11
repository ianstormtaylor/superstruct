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

## Installing Superstruct

To install Superstruct with Yarn or Npm, simply:

```bash
yarn add superstruct
```

```bash
npm install --save superstruct
```

And then you can import it into your code base:

```js
import { struct, superstruct } from 'superstruct'
```

If you would rather import Superstruct with a `<script>` tag, you can use the bundled build:

```html
<script src="https://unpkg.com/superstruct/umd/superstruct.min.js"></script>
```

This will expose the `Superstruct` global with the exported functions.

## Creating Structs

Once you've got Superstruct installed, the next step is to create a struct for some data you want validate. In our case, lets start with data describing a user:

```js
const data = {
  id: 42,
  name: 'Jane Smith',
  email: 'jane@example.com',
}
```

We'll import Superstruct and create a struct with it:

```js
import { struct } from 'superstruct'

const User = struct({
  id: 'number',
  name: 'string',
  email: 'string',
})
```

Now we can use our `User` struct to validate the data. The easiest way to do this is to just call `User` as a function, like so:

```
User(data)
```

This will either throw an error if the data is invalid, or return the validated data if the data is valid.

In this case, the data is valid, so no error is thrown.

But what if we pass it an invalid user object, where the name is not a string:

```js
const data = {
  id: 43,
  name: false,
  email: 'jane@example.com',
}

User(data)

// StructError: 'Expected a value of type "string" for `name` but received `false`.' {
//   type: 'string',
//   value: false,
//   branch: [{ ... }, false],
//   path: ['name'],
// }
```

An error was thrown! That's what we expected.

If you'd rather have the error returned instead of thrown, you can use the `Struct.validate()` method. Or, if you'd just like receive a boolean of whether the data is valid or not, use the `Struct.test()` method.

> 🤖 Check out the [`Struct` interface](https://superstructjs.org/interfaces/struct) for more information.

## Making Values Optional

What about when you have a property like `is_admin` that only appears on a few special users? In that case you can make certain properties optional, like so:

```js
const User = struct({
  id: 'number',
  name: 'string',
  email: 'string',
  is_admin: 'boolean?',
})
```

That `'boolean?'` with a question mark at the end means that the value can also be `undefined` and it will still be considered valid.

So now both of these pieces of data would be valid:

```js
User({
  id: 43,
  name: 'Jane Smith',
  email: 'jane@example.com',
})

User({
  id: 43,
  name: 'Jane Smith',
  email: 'jane@example.com',
  is_admin: true,
})
```

## Setting Default Values

In the case of optional values, you might also want to define a default value for a property if the input is `undefined`. This is helpful for data consistency. For example, you can make the new `is_admin` property default to `false`.

To do that, pass a second argument into `struct` which contains the defaults:

```js
const User = struct(
  {
    id: 'number',
    name: 'string',
    email: 'string',
    is_admin: 'boolean?',
  },
  {
    is_admin: false,
  }
)
```

To receive the data with the defaults applied, you'll need to store the return value from calling `User()`. So your validation becomes:

```js
const data = {
  id: 43,
  name: 'Jane Smith',
  email: 'jane@example.com',
}

const result = User(data)

// {
//   id: '43',
//   name: 'Jane Smith',
//   email: 'jane@example.com',
//   is_admin: false,
// }
```

The original `data` did not define an `is_admin` property, but in the `result` returned from the validation the default has been applied.

## Defining Custom Data Types

Next up, you might have been wondering about the `email` property. So far we've just been using a `'string'` type for it, which means that any old string will pass validation.

But we'd really like to validate that the email is a valid email address.

The `struct` factory that ships with Superstruct by default recognizes all of the native JavaScript data types in its definitions. To define custom data types, we can use the [`Superstruct` reference](https://superstructjs.org/interfaces/superstruct) export instead...

```js
import { superstruct } from 'superstruct'
import isEmail from 'is-email'

const struct = superstruct({
  types: {
    email: value => isEmail(value),
  },
})
```

The `superstruct` super-factory returns your very own `struct` factory, that recognizes all of the built-in types, as wel as any custom data types you configure.

Now we can define structs know about the `'email'` type:

```js
const User = struct(
  {
    id: 'number',
    name: 'string',
    email: 'email',
    is_admin: 'boolean?',
  },
  {
    is_admin: false,
  }
)
```

Now if you pass in an email string that is invalid, it will throw:

```js
const data = {
  id: 43,
  name: 'Jane Smith',
  email: 'jane',
}

User(data)

// StructError: 'Expected a value of type "email" for `email` but received `'jane'`.' {
//   type: 'email',
//   value: 'jane',
//   path: ['email'],
//   branch: [{...}, 'jane'],
//   failures: [...]
// }
```

And there you have it!

> 🤖 For the full list of built-in data types, check out the [`Types` reference](https://superstructjs.org/#types).

## Throwing Customized Errors

Finally, although the errors Superstruct throws are very descriptive, they're not really domain-specific. If you're building a REST or GraphQL API, you probably want to customize your errors to be specific to your application, and to follow a spec.

Doing that with Superstruct is easy. Just `try/catch` the errors like any other error, and then use the exposed information to build your own errors.

For example, lets throw a `'user_email_invalid'` error using the `User` struct from above...

```js
router.post('/users', ({ request, response }) => {
  const data = request.body

  try {
    User(data)
  } catch (e) {
    const { path, value, type } = e
    const key = path[0]

    if (value === undefined) {
      const error = new Error(`user_${key}_required`)
      error.attribute = key
      throw error
    }

    if (type === undefined) {
      const error = new Error(`user_attribute_unknown`)
      error.attribute = key
      throw error
    }

    const error = new Error(`user_${key}_invalid`)
    error.attribute = key
    error.value = value
    throw error
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

In the most common uses, you simply pass a schema definition to the `struct` function, and you'll receive a function that will validate that schema. However, there are more structures of data you might like to validate that simple objects with key/values.

Superstruct makes it easy to validate things like tuples, enums, dictionaries, lists, unions, literals, etc.

For example, say you wanted to validate coordinate tuples:

```js
const Coordinates = struct.tuple(['number', 'number'])

const data = [0, 3]

Coordinates(data)
```

Or, you might want to validate that one of the properties of your user objects is an enum of a particular set of values:

```js
const User = struct({
  id: 'number',
  name: 'string',
  role: struct.enum(['collaborator', 'owner', 'admin']),
})
```

All of this can be achieved using the helpers exposed on the `struct` function.

> 🤖 For a full list of the kinds of structs you can create, check out the [`Superstruct` interface](https://superstructjs.org/interfaces/superstruct).

## Composing Structs

Sometimes you want to break validations down into components, and compose them together to validate more complex objects. Superstruct makes this easy by allowing an existing struct to be passed in as a schema. For example:

```js
const User = struct({
  id: 'number',
  name: 'string',
})

const Article = struct({
  id: 'number',
  title: 'string',
  author: User,
})
```

Anywhere that you can use a 'number' style string to represent a schema, you can pass a full-fledged Struct in too. So you could use it in `tuple`, `enum`, `array`, `record`, etc. as well:

```js
const Filter = struct({
  eq: 'object?',
  lt: 'object?',
  gt: 'object?',
})

const Filters = struct.record(['string', Filter])
```
