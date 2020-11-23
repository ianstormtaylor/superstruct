# Handling Errors

By default Superstruct throws errors that are easy to understand for developers. This means that out of the box you'll get nice errors messages that help you track down why a piece of data is invalid.

For example, consider a simple `User` struct:

```ts
const User = object({
  id: number(),
  name: string(),
  email: email(),
})
```

If you pass in an invalid email, an error will be thrown:

```ts
const data = {
  id: 1,
  name: 'Alex',
  email: false,
}

assert(data, User)
// StructError: At path: email -- Expected a string, but received: false
```

In addition to the error message, the `error` object will have a bunch of useful properties on it:

```ts
StructError {
  value: false,
  key: 'email',
  type: 'string',
  refinement: undefined,
  path: ['email'],
  branch: [{ id: 1, name: 'Alex', email: false }, false],
  failures: [Function]
}
```

You can use those properties to perform whatever logic is necessary to recover from errors in your application.

> To see all of the information embedded in `StructError` objects, check out the [`StructError` reference](../reference/errors.md).

# Customizing Errors

But there are cases where you want more control over the errors, especially when displaying error messages to end users. For example, if you're building a REST or GraphQL API, you probably want to customize your errors to be specific to your application, and to follow a spec.

To make this possible, you can catch the errors, and use their built-in properties to build up your own custom error codes or messages.

For example, consider a REST API for creating users:

```ts
router.post('/users', ({ request, response }) => {
  const data = request.body

  try {
    assert(data, User)
  } catch (e) {
    const { key, value, type } = e

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

When a developer tries to create a user with invalid properties, the error responses given by the API are standardized. You end up with errors with codes like:

```
user_email_invalid
user_email_required
user_email_unknown

user_name_invalid
user_name_required
...
```

Although this example is simplified, the struct errors expose all of the possible information about why the validation failed, so you can use them to construct extremely detailed errors for your end users.

# Multiple Failures

By default Superstruct throws an error for the very first failure encountered during validation. This greatly simplifies logic for most cases, and results in the best performance.

However, there are situations where you need to check for all of the potential errors in a single piece of data. To do that, you can use the `error.failures` generator, like so:

```ts
try {
  assert(data, Struct)
} catch (error) {
  for (const failure of error.failures()) {
    // ...
  }
}
```

Each `failure` object will give you information about a specific failure of the data.

> 🤖 Note: Superstruct actually doesn't know what the failures are beyond the first one _until_ you iterate through them. This happens "on-demand", which can signficantly improve performance in failure cases.
