# Changelog

This document maintains a list of changes to the `superstruct` package with each new version. Until `1.0.0` is released, breaking changes will be added as minor version bumps, and smaller changes and fixes won't be detailed.

---

### `0.6.0` — September 13, 2018

###### BREAKING

* **Invalid `Date` objects are now considered invalid.** Previously using the built-in `'date'` validator would only check that the object was a `Date` instance, and not that it was a valid one. This has been fixed, and although it is technically a breaking change, most everyone would have expected this behavior to begin with.

---

### `0.5.0` — December 21, 2017

###### BREAKING

* **Validators must now return `true`, `false` or an error reason string.** Previously any truthy value would be considered valid. Now you can provide more information for the thrown errors by providing a string which will be attached as `error.reason`. However, this means that truthy string values now equate to invalid, not valid.

* **Property validators now receive `data` as their second argument.** Previously you only had access to the property `value`, but now you also have access to the entire object's `data`.

###### NEW

* **Errors can now contain reason information.** Validator functions can now return string instead of a boolean, denoting the reason a value was invalid. This can then be used to create more helpful error messages.

---

### `0.4.0` — December 1, 2017

###### BREAKING

* **`object` structs are no longer optional-ish.** Previously object struct types would not throw if `undefined` was passed and no properties were required. This was not only confusing, but complex to maintain. Now if you want an object struct to be optional, use the `struct.optional(...)` helper.

* **Removed the `Struct.default` method.** If you need to get the default value, use the `Struct.validate` or `Struct.assert` methods's return value instead.

###### NEW

* **Added the `dict`, `enum`, `intersection`, `union` and `tuple` structs.** These are all available as `struct.dict`, `struct.enum`, etc.

---

### `0.3.0` — November 30, 2017

###### BREAKING

* **The `validate()` method now returns `[ error, result ]`.** Previously it only had a single return value, which necessitated extra type checking to see if the value was an error or a result. Now you can just destructure the array to get either return value, for easier coding.

* **Errors have been simplified, removing "codes".** Previously there were multiple types of errors that were thrown and you could differentiate between them with the `error.code` property. But the other properties of the error already let you infer the code, so having multiple types of errors made for a larger API surface without much benefit.

---

### `0.2.0` — November 30, 2017

###### BREAKING

* **Structs are now functions again.** :smile: They are built on the same underlying schema classes underneath though, since that helps the code structure. But to allow for the `struct = Struct({ ... })` syntax the structs themselves have changed to be function.

###### NEW

* **The basic case is now `Struct(data)`.** Previously you had to use `Struct.assert(data)`. Although the `assert` method (and others) are still there, the basic case is a bit terser and more similar to the struct-initializing APIs in other languages.

---

### `0.1.0` — November 29, 2017

###### BREAKING

* **Structs are now classes instead of functions.** This is better in terms of the API being a bit less magic-y. It's also useful so that we can add other helpful methods to structs besides the `assert` method. What was previously `struct(data)` is now `struct.assert(data)`.

---

### `0.0.0` — November 24, 2017

:tada:
