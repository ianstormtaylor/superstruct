
# Getting Started

- [Installing Superstruct](#installing-superstruct)
- [Creating Structs](#creating-structs)
- [Defining Custom Data Types](#defining-custom-data-types)
- [Setting Default Values](#setting-default-values)
- [Throwing Customized Errors](#throwing-customized-errors)


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
<script src="https://unpkg.com/superstruct/dist/superstruct.min.js"></script>
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
  name: 'Jane Smith',
  email: 'jane@example.com',
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

// StructError: 'Expected the `name` property to be of type "string", but it was `false`.' {
//   code: 'property_invalid',
//   type: 'string',
//   path: ['name'],
//   key: 'name',
//   value: false,
// }
```

An error was thrown! That's what we expected.

If you'd rather have the error returned instead of thrown, you can use the `Struct.validate()` method. Or, if you'd just like receive a boolean of whether the data is valid or not, use the `Struct.test()` method. Check out the [Reference](./reference.md) for more information.


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
  id: 'number',
  name: 'Jane Smith',
  email: 'jane@example.com',
})

User({
  id: 'number',
  name: 'Jane Smith',
  email: 'jane@example.com',
  is_admin: true,
})
```


## Setting Default Values

In the case of optional values, you might also want to define a default value for a property if the input is `undefined`. This is helpful for data consistency. For example, you can make the new `is_admin` property default to `false`.

To do that, pass a second argument into `struct` which contains the defaults:

```js
const User = struct({
  id: 'number',
  name: 'string',
  email: 'string',
  is_admin: 'boolean?',
}, {
  is_admin: false,
})
```

To receive the data with the defaults applied, you'll need to store the return value from calling `User()`. So your validation becomes:

```js
const data = {
  id: 'number',
  name: 'Jane Smith',
  email: 'jane@example.com',
}

const result = User(data)

// {
//   id: 'number',
//   name: 'Jane Smith',
//   email: 'jane@example.com',
//   is_admin: false,
// }
```

The original `data` did not define an `is_admin` property, but in the `result` returned from the validation the default has been applied.


## Defining Custom Data Types

Next up, you might have been wondering about the `email` property. So far we've just been using a `'string'` type for it, which means that any old string will pass validation.

But we'd really like to validate that the email is a valid email address. To do that, we can define custom data types (which are just functions that return `true` or `false`) using the `superstruct` export, and build structs that are aware of them.

```js
import { superstruct } from 'superstruct'
import isEmail from 'is-email'

const struct = superstruct({
  types: {
    email: isEmail,
  }
})
```

To do that, we've imported import `superstruct` instead of `struct`. And with that, we've created your own `struct` factory. 

Now we can define structs know about the `'email'` type:

```js
const User = struct({
  id: 'number',
  name: 'string',
  email: 'email',
  is_admin: 'boolean?',
}, {
  is_admin: false,
})
```

Now if you pass in an email string that is invalid, it will throw:

```js
const data = {
  id: 43,
  name: 'Jane Smith',
  email: 'jane',
}

User(data)

// StructError: 'Expected the `email` property to be of type "email", but it was `'jane'`.' {
//   code: 'property_invalid',
//   type: 'email',
//   path: ['email'],
//   key: 'email',
//   value: 'jane',
// }
```

And there you have it! 


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
    switch (e.code) {
      default: 
        throw e
      case 'value_invalid': 
        const error = new Error(`user_attributes_invalid`)
        error.value = data
        throw error
      case 'value_required': 
        throw new Error(`user_attributes_required`)
      case 'property_invalid':
        const error = new Error(`user_${e.key}_invalid`)
        error.attribute = e.key
        error.value = e.value
        throw error
      case 'property_required':
        const error = new Error(`user_${e.key}_required`)
        error.attribute = e.key
        throw error
      case 'property_unknown':
        const error = new Error(`user_${e.key}_unknown`)
        error.attribute = e.key
        throw error
    }
  }
})
```

Now all of your user validation errors are standardized, so you end up with errors with codes like:

```
user_attributes_invalid
user_attributes_required

user_email_invalid
user_email_required
user_email_unknown

user_name_invalid
...
```

Although this example is simplified, the struct errors expose all of the possible information about why the validation failed, so you can use them to construct extremely detailed errors for your end users.
