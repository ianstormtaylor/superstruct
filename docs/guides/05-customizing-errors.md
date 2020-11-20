# Customizing Errors

By default Superstruct throws errors that are easy to understand for developers. This means that out of the box you'll get nice errors messages that help you track down why a piece of data is invalid.

But there are cases where you want more control over the errors, especially when displaying error messages to end users. For example, if you're building a REST or GraphQL API, you probably want to customize your errors to be specific to your application, and to follow a spec.

# Custom Errors

To make this possible, Superstruct's errors also encode a lot of information about exactly what caused the failure. And you can use that information to build up your own custom error codes or messages.

For example, consider a simple `User` struct:

```ts
const User = object({
  id: number(),
  name: string(),
  email: email(),
})
```

We can catch the validation errors it throws and use their information to construct our own domain-specific errors, like so:

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

> To see all of the information embedded in `StructError` objects, check out the [`StructError` reference](../reference/errors.md).

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
