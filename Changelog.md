# Changelog

This document maintains a list of changes to the `superstruct` package with each new version. Until `1.0.0` is released, breaking changes will be added as minor version bumps, and smaller changes and fixes won't be detailed.

### `0.10.0` — June 6, 2020

The `0.10` version is a complete overhaul with the goal of making Superstruct much simpler and easier to understand, and with complete support for runtime type signatures TypeScript.

This makes it much more powerful, however the core architecture has had to change to make it happen. It will still look very similar, but migrating between the versions _will be more work than usual_. There's no requirement to upgrade, although if you're using Superstruct in concert with TypeScript you will have a much better experience.

###### BREAKING

**All types are created from factories.** Previously depending on whether the type was a complex type or a scalar type they'd be defined different. Complex types used factories, whereas scalars used strings. Now all types are exposed as factories.

For example, previously:

```ts
import { struct } from 'superstruct'

const User = struct.object({
  name: 'string',
  age: 'number',
})
```

Now becomes:

```ts
import { object, string, number } from 'superstruct'

const User = object({
  name: string(),
  age: number(),
})
```

**Custom scalars are no longer pre-defined as strings.** Previously, you would define all of your "custom" types in a single place in your codebase and then refer to them in structs later on with a string value. This worked, but added a layer of unnecessary indirection, and made it impossible to accomodate runtime type signatures.

In the new version, custom types are defined extremely similarly to non-custom types. And this has the added benefit that you can easily trace the custom type definitions by just following `import` statements.

Here's how it used to work:

```ts
import { superstruct } from 'superstruct'
import isEmail from 'is-email'

const struct = superstruct({
  types: {
    email: isEmail,
  },
})

const Email = struct('email')
```

And here's what it would look like now:

```ts
import { struct } from 'superstruct'
import isEmail from 'is-email'

const Email = struct('email', isEmail)
```

**Validation logic has been moved to helper functions.** Previously the `assert` and `is` helpers lived on the struct objects themselves. Now, these functions have been extracted into separate helpers. This was unfortunately necessary to work around limitations in TypeScript's `asserts` keyword.

For example, before:

```ts
User.assert(data)
```

Now would be:

```ts
import { assert } from 'superstruct'

assert(data, User)
```

**Coercion is now separate from validation.** Previously there was native logic for handling default values for structs when validating them. This has been abstracted into the ability to define _any_ custom coercion logic for structs, and it has been separate from validation to make it very clear when data can change and when it cannot.

For example, previously:

```ts
const output = User.assert(input)
```

Would now be:

```ts
const input = coerce(input, User)
```

The `coerce` step is the only time that data will be transformed at all by coercion logic, and the `assert` step no longer needs to return any values. This makes it easy to do things like:

```ts
if (is(input, User)) {
  // ...
}
```

**Validation context is now a dictionary of properties.** Previously when performing complex validation logic that was dependent on other properties on the root object, you could use the second `branch` argument to the validation function. This argument has been changed to be a `context` dictionary with more information. The same branch argument can now be accessed as `context.branch`, along with the new information.

**Unknown properties of objects now have a `'never'` type.** Previously unknown properties would throw errors with `type === null`, however the newly introduced `'never'` type is now used instead.

**Defaults are now defined with a separate coercion helper.** Previously all structs took a second argument that defined the default value to use if an `undefined` value was present. This has been pulled out into a separate helper now to clearly distinguish coercion logic.

For example, previously you'd do:

```ts
const Article = struct.object(
  {
    title: 'string',
  },
  {
    title: 'Untitled',
  }
)
```

Whereas now you'd do:

```ts
const Article = defaulted(
  object({
    title: string(),
  }),
  {
    title: 'Untitled',
  }
)
```

**Optional arguments are now defined with a seperate factory.** Similarly to defaults, there is a new `optional` factory for defined values that can also be `undefined`.

Previously you'd do:

```ts
const Flag = struct('string?')
```

Now you'd do:

```ts
const Flag = optional(string())
```

**Several structs have been renamed.** This was necessary because structs are now exposed directly as variables, which runs afoul of reserved words. So the following renames have been applied:

- `interface` -> `type`
- `enum` -> `enums`
- `function` -> `func`

### `0.8.0` — October 8, 2019

###### BREAKING

**Several structs have been renamed!** Superstruct tries to mimic established naming schemes whenever possible for its API, and TypeScript is one of our main comparisons. To make things easier for people, we've renamed a few structs to more closely match their TypeScript counterparts:

- The `list` struct is now called `array`.
- The `partial` struct is now called `pick`.
- The `dict` struct is now called `record`.

Hopefully this will make them easier to understand at a glance!

**The `enums` struct has been removed!** This was special-cased in the API previously, but you can get the exact same behavior by creating an using the `array` and `enum` structs:

```js
struct.array(struct.enum(['red', 'blue', 'green']))
```

**The `any` struct has been removed! (Not the scalar though.)** Previously `struct.any()` was exposed that did the same thing as `struct()`, allowing you to use shorthands for common structs. But this was confusingly named because it has nothing to do with the `'any'` scalar type. And since it was redundant it has been removed.

**The `interface` struct now returns the original, unaltered value!** In an effort to make things more familiar, the `interface` struct now always returns the object that it is called with when it passes validation. So if the object was a function, a function will be returned. This makes it match more closely with the idea of "structural typing" that TypeScript and other typing systems are based on. \_If you want the old behavior, use the `pick` struct.

**Computed values function signatures have changed!** Previously a computed value would be called with a signature of `(value, root)` in some cases and `(value, parent)` in others. This was confusing, and the cause for the inconsistency was complex. This logic has been simplified, and now computed values are called with `(value, branch, path)` in all cases.

```js
struct.dynamic((value, branch, path) => {
  value === branch[branch.length - 1] // you can get the value...
  const parent = branch[branch.length - 2] // ...and the parent...
  const key = path[path.length - 1] // ...and the key...
  value === parent[key]
  const root = branch[0] // ...and the root!
})
```

The `path` is an array of keys representing the nested value's location in the root value. And the `branch` is an array of all of the sub values along the path to get to the current one. This allows you to always be able to receive both the **parent** and the **root** values from any location—as well as any value in between.

**The `error.errors` property has been renamed `error.failures`, and isn't cyclical.** It being cyclical caused lots of issues whenever an `StructError` object was attempted to be serialized. And the `errors` property was slightly confusing because the elements of the array weren't full error objects. The new structure is easier to understand and work with.

**The `error.reason` property is no longer special-cased.** Previously you could return a "reason" string from validator functions and it would be added to error objects. However, now you must return an error properties object (with a `reason` property if you'd like), and all of the properties will be added to the error object. This makes Superstruct even more flexible as far as custom error details go.

**The `type` property of structs have been rewritten to be more clear.** This is an implementation mostly, but the `struct.type` string which shows up in error messages have been tweaked to be slightly more clear exactly what type they are checking for.

###### NEW

**Superstruct is now written in TypeScript.** It was rewritten from the ground up to make use of types, and to have better inline documented if you use a TypeScript-compatible IDE. There are probably improvements that can be made, so if you'd like to contribute please do!

**A new `partial` struct mimics TypeScript's `Partial` utility.** The new struct validates that its input partially matches an object defined as a set of properties with associated types. All of the properties of the object are optional.

**A new `size` struct allows validating array and string lengths.** The new struct validates that its input has a certain size, by checking its `length` property. This works strings or arrays.

**You can now provide a custom `Error` setting.** By passing in your own constructor when configuring Superstruct you can have complete control over the exact errors that are generated by structs that fail validation.

### `0.7.0` — September 21, 2019

###### BREAKING

- **The build process now outputs ES5 code.** Previously it was outputting ES6 code, which posed problems for some builders. This change shouldn't really affect anyone negatively, but it's being released as a breaking version just in case.

---

### `0.6.0` — September 13, 2018

###### BREAKING

- **Invalid `Date` objects are now considered invalid.** Previously using the built-in `'date'` validator would only check that the object was a `Date` instance, and not that it was a valid one. This has been fixed, and although it is technically a breaking change, most everyone would have expected this behavior to begin with.

---

### `0.5.0` — December 21, 2017

###### BREAKING

- **Validators must now return `true`, `false` or an error reason string.** Previously any truthy value would be considered valid. Now you can provide more information for the thrown errors by providing a string which will be attached as `error.reason`. However, this means that truthy string values now equate to invalid, not valid.

- **Property validators now receive `data` as their second argument.** Previously you only had access to the property `value`, but now you also have access to the entire object's `data`.

###### NEW

- **Errors can now contain reason information.** Validator functions can now return string instead of a boolean, denoting the reason a value was invalid. This can then be used to create more helpful error messages.

---

### `0.4.0` — December 1, 2017

###### BREAKING

- **`object` structs are no longer optional-ish.** Previously object struct types would not throw if `undefined` was passed and no properties were required. This was not only confusing, but complex to maintain. Now if you want an object struct to be optional, use the `struct.optional(...)` helper.

- **Removed the `Struct.default` method.** If you need to get the default value, use the `Struct.validate` or `Struct.assert` methods's return value instead.

###### NEW

- **Added the `dict`, `enum`, `intersection`, `union` and `tuple` structs.** These are all available as `struct.dict`, `struct.enum`, etc.

---

### `0.3.0` — November 30, 2017

###### BREAKING

- **The `validate()` method now returns `[ error, result ]`.** Previously it only had a single return value, which necessitated extra type checking to see if the value was an error or a result. Now you can just destructure the array to get either return value, for easier coding.

- **Errors have been simplified, removing "codes".** Previously there were multiple types of errors that were thrown and you could differentiate between them with the `error.code` property. But the other properties of the error already let you infer the code, so having multiple types of errors made for a larger API surface without much benefit.

---

### `0.2.0` — November 30, 2017

###### BREAKING

- **Structs are now functions again.** :smile: They are built on the same underlying schema classes underneath though, since that helps the code structure. But to allow for the `struct = Struct({ ... })` syntax the structs themselves have changed to be function.

###### NEW

- **The basic case is now `Struct(data)`.** Previously you had to use `Struct.assert(data)`. Although the `assert` method (and others) are still there, the basic case is a bit terser and more similar to the struct-initializing APIs in other languages.

---

### `0.1.0` — November 29, 2017

###### BREAKING

- **Structs are now classes instead of functions.** This is better in terms of the API being a bit less magic-y. It's also useful so that we can add other helpful methods to structs besides the `assert` method. What was previously `struct(data)` is now `struct.assert(data)`.

---

### `0.0.0` — November 24, 2017

:tada:
