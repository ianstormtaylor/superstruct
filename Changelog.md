
# Changelog

This document maintains a list of changes to the `superstruct` package with each new version. Until `1.0.0` is released, breaking changes will be added as minor version bumps, and smaller changes and fixes won't be detailed.


---


### `0.4.0` — December 1, 2017

###### BREAKING

- **`object` structs are no longer optional-ish.** Previously object struct types would not throw if `undefined` was passed and no properties were required. This was not only confusing, but complex to maintain. Now if you want an object struct to be optional, use the `struct.optional(...)` helper.

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
