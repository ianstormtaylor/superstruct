
# Changelog

This document maintains a list of changes to the `superstruct` package with each new version. Until `1.0.0` is released, breaking changes will be added as minor version bumps, and smaller changes and fixes won't be detailed.


---


### `0.1.0` — November 29, 2017

###### BREAKING

- **Structs are now classes instead of functions.** This is better in terms of the API being a bit less magic-y. It's also useful so that we can add other helpful methods to structs besides the `assert` method. What was previously `struct(data)` is now `struct.assert(data)`.


---


### `0.0.0` — November 24, 2017

:tada:
