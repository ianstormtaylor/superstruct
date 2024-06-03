# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [3.0.0]

### Added

- Newly exports the following types: `AnyStruct`, `EnumSchema`, `InferStructTuple`, `IsExactMatch`, `IsMatch`, `IsRecord`, `IsTuple`, `ObjectSchema`, `OmitBy`, `Optionalize`, `PickBy`, `Simplify`, `UnionToIntersection` ([#18](https://github.com/MetaMask/superstruct/pull/18)).

### Fixed

- **BREAKING:** Expose separate build entry points and type declarations for CommonJS and ESM via package manifest `exports`. ([#18](https://github.com/MetaMask/superstruct/pull/18))

## [2.0.0]

### Changed

- Prepare package for releasing under `@metamask` organisation ([#1](https://github.com/MetaMask/superstruct/pull/1), [#3](https://github.com/MetaMask/superstruct/pull/3), [#4](https://github.com/MetaMask/superstruct/pull/4), [#5](https://github.com/MetaMask/superstruct/pull/5), [#6](https://github.com/MetaMask/superstruct/pull/6), [#7](https://github.com/MetaMask/superstruct/pull/7), [#8](https://github.com/MetaMask/superstruct/pull/8), [#12](https://github.com/MetaMask/superstruct/pull/12), [#15](https://github.com/MetaMask/superstruct/pull/15))
  - The package name is now `@metamask/superstruct`.
  - The changelog file has been renamed to `CHANGELOG.md`, and the format has changed to fit MetaMask's changelog style.

### Fixed

- **BREAKING:** Expose CommonJS and ESM builds via package manifest `exports` ([#5](https://github.com/MetaMask/superstruct/pull/5))
  - It's no longer possible to import files from the `dist` folder directly.

## [1.0.0]

### Added

- Add an optional `message` argument to override error messages.
  - You can now pass in a `message` argument to all of the error checking
    functions which will override any error message with your own message. If
    you do, Superstruct's original descriptive message will still be accessible
    via [`error.cause`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause).
  - For example:
    ```ts
    assert(data, User, "The user is invalid!");
    // StructError: The user is invalid!
    ```

## [0.16.0]

### Changed

- **BREAKING:** Refinement functions are now called with valid, but potentially
  unrefined values.
  - Previously the functions passed in to `refine` would always be called with
    sub-elements (e.g., when using objects or arrays) that were completely valid
    **and** refined. However, this prevented collecting all the refinement
    errors from subelements in a validation in one go, which is common when
    validating forms. _Note: this should not have any effect on almost all use
    cases, so you're safe to upgrade._

## [0.15.0]

### Fixed

- Unions can now be coerced.
  - Previously unions created a barrier in coercion such that structs nested
    inside unions would not have their coercion logic triggered, but this has
    been fixed.
- Assigning preserves `type` structs.
  - Previously using the `assign` helper would implicitly convert `type` structs
    into `object` structs which wasn't expected and confusing, but this has been
    fixed.

## [0.14.0]

### Changed

- **BREAKING:** The `mask` helper now works for nested objects.
  - Previously it would only mask the properties at the top-level of a struct,
    however now it acts deeply. You can use it to define object structs once, but
    use them either strictly or loosely.
- **BREAKING:** The `masked` coercion has been removed.
  - This previously allowed you to mix in masking to a specific struct, but the
    `mask` helper is a more robust way to do this, and it doesn't force you to
    maintain two separate structs.

## [0.13.0]

### Added

- Structs can now define an `entries` iterator for nested values.
  - Previously iterating through nested values was defined in a one-off manner
    inside certain structs, but this led to non-uniform support. Now, any struct
    can define an `entries` iterator that will cause nested values to be
    automatically coerced and validated.
- Coercion receives `context` objects and supports nested values.
  - Previously context objects were only passed to the validations and
    refinements. But the same context is passed to coercions too so you can
    implement more complex logic. And coercions are automatically applied to
    nested values thanks to the addition of `entries`.

### Changed

- Iteration logic has gotten simpler, and more performant.
  - The addition of the `entries` logic has enabled us to only ever iterate
    through a tree of values one time for coercion and validation, instead of
    once each. This should speed up most standard use cases.

### Removed

- **BREAKING:** The `ctx.fail()` function has been removed.
  - Previously you'd use it to return more information about a failure inside a
    struct. Now you can simply return a partial failure object.
- **BREAKING:** The `ctx.check()` function has been removed.
  - Previously you'd use it to validate nested objects in more complex struct
    shapes. Now you can use the new `entries` property for this instead.
- **BREAKING:** The `context.struct` and `context.value` properties have been
  removed.
  - These properties were previously available, but unnecessary since anywhere
    you have the context object you will also know the `value` and the specific
    struct that is being validated. Keeping them around required extra
    unnecessary plumbing in the library that made composing structs much more
    difficult, so they were removed.
  -

## [0.12.0]

### Added

- New `Describe` utility type.

  - This new utility lets you define a struct from an existing TypeScript type
    and ensure that the struct's validation matches it, otherwise TypeScript's
    compiler will error. For example:

    ```ts
    type User = {
      id: number;
      name: string;
    };

    const User: Describe<User> = object({
      id: string(), // This mistake will fail to pass type checking!
      name: string(),
    });
    ```

### Changed

- **BREAKING:** The `coerce` helper has changed to be more type-safe.

  - Previously `coerce` functions were called with `value: unknown` because they
    ran before all validation. However, now they take a new second argument that
    is another struct to narrow the cases where coercions occurs. This means the
    `value` for coercion will now be type-safe.
  - For example:

    ```ts
    // Previously
    const MyNumber = coerce(number(), (value) => {
      return typeof value === "string" ? parseFloat(value) : value;
    });

    // Now
    const MyNumber = coerce(number(), string(), (value) => {
      return parseFloat(value);
    });
    ```

## [0.11.0]

### Added

- New `assign`, `pick`, and `omit` object utilities.

  - These utilities make composing object structs together possible, which should
    make re-using structs in your codebase easier.
  - For example:

    ```ts
    // Combine two structs with `assign`:
    const a = object({ id: number() });
    const b = object({ name: string() });
    const c = assign([a, b]);

    // Pick out specific properties with `pick`:
    const a2 = pick(c, ["id"]);

    // Omit specific properties with `omit`:
    const a3 = omit(c, ["name"]);
    ```

- New `unknown` struct.
  - This is the same as the existing `any` struct, but it will ensure that in
    TypeScript the value is of the more restrictive `unknown` type, so it
    encourages better type safety.
  - For example:
    ```ts
    const Shape = type({
      id: number(),
      name: string(),
      other: unknown(),
    });
    ```
- New `integer`, `regexp`, and `func` structs.
  - These are just simple additions for common use cases of ensuring a value is
    an integer, a regular expression object (not a string!), or a function.
  - For example:
    ```ts
    const Shape = type({
      id: integer(),
      matches: regexp(),
      send: func(),
    });
    ```
- New `max/min` refinements.
  - For refining `number` (or `integer`) or `date` structs to ensure they are
    greater than or less than a specific threshold. The third argument can
    indicate whether to make the threshold exclusive (instead of the default
    inclusive).
  - For example:
    ```ts
    const Index = min(number(), 0);
    const PastOrPresent = max(date(), new Date());
    const Past = max(date(), new Date(), { exclusive: true });
    ```
- Even more information on errors.
  - Errors now expose the `error.refinement` property when the failure
    originated in a refinement validation. And they also now have an `error.key`
    property which is the key for the failure in the case of complex values like
    arrays/objects. (Previously the key was retrievable by checking `error.path`,
    but this will make the 90% case easier.)

### Changed

- **BREAKING:** The `coerce` helper has been renamed to `create`.

  - This will hopefully make it more clear that it's fully coercing and validating
    a value against a struct, throwing errors if the value was invalid. This has
    caused confusion for people who though it would just coerce the value and
    return the unvalidated-but-coerced version.
  - For example:

    ```ts
    // Previously
    const user = coerce(data, User);

    // Now
    const user = create(data, User);
    ```

- **BREAKING:** The `struct`, `refinement` and `coercion` factories have been
  renamed.

  - This renaming is purely for keeping things slightly cleaner and easier to
    understand. The new names are `define`, `refine`, and `coerce`. Separating
    them slightly from the noun-based names used for the types themselves.
  - For example:

    ```ts
    // Previously
    const Email = struct('email', isEmail)
    const Positive = refinement('positive', number(), n => n > 0)
    const Trimmed = coercion(string(), s => s.trim()

    // Now
    const Email = define('email', isEmail)
    const Positive = refine(number(), 'positive', n => n > 0)
    const Trimmed = coerce(string(), s => s.trim())
    ```

- **BREAKING:** The `length` refinement has been renamed to `size`.

  - This is to match with the expansion of it's abilities from purely strings and
    arrays to also now include numbers, maps, and sets. In addition you can also
    omit the `max` argument to specify an exact size:
  - For example:

    ```ts
    // Previously
    const Name = length(string(), 1, 100);
    const MyArray = length(array(string()), 3, 3);

    // Now
    const Name = size(string(), 1, 100);
    const MyArray = size(array(string()), 3);
    const Id = size(integer(), 1, Infinity);
    const MySet = size(set(), 1, 9);
    ```

- **BREAKING:** The `StructType` inferring helper has been renamed to `Infer`.

  - This just makes it slightly easier to read what's going on when you're inferring
    a type.
  - For example:

    ```ts
    // Previously
    type User = StructType<typeof User>;

    // Now
    type User = Infer<typeof User>;
    ```

- **BREAKING:** The `error.type` property has been standardized.

  - Previously it was a human-readable description that sort of incorporated the
    schema. Now it is simple the plain lowercase name of the struct in question,
    making it something you can use programmatically when formatting errors.
  - For example:

    ```ts
    // Previously
    "Array<string>";
    "[string,number]";
    "Map<string,number>";

    // Now
    "array";
    "tuple";
    "map";
    ```

## [0.10.0]

### Changed

- **BREAKING:** All types are created from factories.

  - Previously depending on whether the type was a complex type or a scalar type
    they'd be defined different. Complex types used factories, whereas scalars
    used strings. Now all types are exposed as factories.
  - For example:

    ```ts
    // Previously
    const User = struct.object({
      name: "string",
      age: "number",
    });

    // Now
    const User = object({
      name: string(),
      age: number(),
    });
    ```

- **BREAKING:** Custom scalars are no longer pre-defined as strings.

  - Previously, you would define all of your "custom" types in a single place in
    your codebase and then refer to them in structs later on with a string value.
    This worked, but added a layer of unnecessary indirection, and made it
    impossible to accomodate runtime type signatures.
  - For example:

    ```ts
    // Previously
    const struct = superstruct({
      types: {
        email: isEmail,
      },
    });

    const Email = struct("email");

    // Now
    const Email = struct("email", isEmail);
    ```

- **BREAKING:** Coercion is now separate from validation.
  - Previously there was native logic for handling default values for structs when
    validating them. This has been abstracted into the ability to define _any_
    custom coercion logic for structs, and it has been separate from validation to
    make it very clear when data can change and when it cannot.
  - For example:
    ```ts
    const output = User.assert(input);
    // Would now be:
    const input = coerce(input, User);
    ```
- **BREAKING:** Validation context is now a dictionary of properties.
  - Previously when performing complex validation logic that was dependent on
    other properties on the root object, you could use the second `branch` argument
    to the validation function. This argument has been changed to be a `context`
    dictionary with more information. The same branch argument can now be accessed
    as `context.branch`, along with the new information.
- **BREAKING:** Unknown properties of objects now have a `'never'` type.
  - Previously unknown properties would throw errors with `type === null`, however
    the newly introduced `'never'` type is now used instead.
- **BREAKING:** Defaults are now defined with a separate coercion helper.

  - Previously all structs took a second argument that defined the default value
    to use if an `undefined` value was present. This has been pulled out into a
    separate helper now to clearly distinguish coercion logic.
  - For example:

    ```ts
    const Article = struct.object(
      {
        title: "string",
      },
      {
        title: "Untitled",
      }
    );

    // Now
    const Article = defaulted(
      object({
        title: string(),
      }),
      {
        title: "Untitled",
      }
    );
    ```

- **BREAKING:** Optional arguments are now defined with a separate factory.

  - Similarly to defaults, there is a new `optional` factory for defined values
    that can also be `undefined`.
  - For example:

    ```ts
    const Flag = struct("string?");

    // Now
    const Flag = optional(string());
    ```

- **BREAKING:** Several structs have been renamed.
  - This was necessary because structs are now exposed directly as variables, which
    runs afoul of reserved words. So the following renames have been applied:
    - `interface` -> `type`
    - `enum` -> `enums`
    - `function` -> `func`

## [0.8.0]

### Added

- Superstruct is now written in TypeScript.
  - It was rewritten from the ground up to make use of types, and to have better
    inline documented if you use a TypeScript-compatible IDE. There are probably
    improvements that can be made, so if you'd like to contribute please do!
- A new `partial` struct mimics TypeScript's `Partial` utility.
  - The new struct validates that its input partially matches an object defined as
    a set of properties with associated types. All of the properties of the object
    are optional.
- A new `size` struct allows validating array and string lengths.
  - The new struct validates that its input has a certain size, by checking its
    `length` property. This works strings or arrays.
- You can now provide a custom `Error` setting.
  - By passing in your own constructor when configuring Superstruct you can have
    complete control over the exact errors that are generated by structs that fail
    validation.

### Changed

- **BREAKING:** Several structs have been renamed.
  - Superstruct tries to mimic established naming schemes whenever possible for its
    API, and TypeScript is one of our main comparisons. To make things easier for
    people, we've renamed a few structs to more closely match their TypeScript
    counterparts:
    - The `list` struct is now called `array`.
    - The `partial` struct is now called `pick`.
    - The `dict` struct is now called `record`.
- **BREAKING:** The interface struct now returns the original, unaltered value!
  - In an effort to make things more familiar, the `interface` struct now always
    returns the object that it is called with when it passes validation. So if the
    object was a function, a function will be returned. This makes it match more
    closely with the idea of "structural typing" that TypeScript and other typing
    systems are based on. _If you want the old behavior, use the `pick` struct._
- **BREAKING:** Computed values function signatures have changed!
  - Previously a computed value would be called with a signature of `(value, root)`
    in some cases and `(value, parent)` in others. This was confusing, and the
    cause for the inconsistency was complex. This logic has been simplified, and
    now computed values are called with `(value, branch, path)` in all cases.
  - For example:
    ```ts
    struct.dynamic((value, branch, path) => {
      value === branch[branch.length - 1]; // you can get the value...
      const parent = branch[branch.length - 2]; // ...and the parent...
      const key = path[path.length - 1]; // ...and the key...
      value === parent[key];
      const root = branch[0]; // ...and the root!
    });
    ```
- **BREAKING:** The `error.errors` property has been renamed `error.failures`, and
  isn't cyclical.
  - It being cyclical caused lots of issues whenever an `StructError` object was
    attempted to be serialized. And the `errors` property was slightly confusing
    because the elements of the array weren't full error objects. The new structure
    is easier to understand and work with.
- **BREAKING:** The `error.reason` property is no longer special-cased.
  - Previously you could return a "reason" string from validator functions and it
    would be added to error objects. However, now you must return an error properties
    object (with a `reason` property if you'd like), and all of the properties will
    be added to the error object. This makes Superstruct even more flexible as far
    as custom error details go.
- The `type` property of structs have been rewritten to be more clear.
  - This is an implementation mostly, but the `struct.type` string which shows up in
    error messages have been tweaked to be slightly more clear exactly what type they
    are checking for.

### Removed

- **BREAKING:** The `enums` struct has been removed.
  - This was special-cased in the API previously, but you can get the exact same
    behavior by creating it using the `array` and `enum` structs:
    ```ts
    struct.array(struct.enum(["red", "blue", "green"]));
    ```
- **BREAKING:** The `any` struct has been removed! (Not the scalar though.)
  - Previously `struct.any()` was exposed that did the same thing as `struct()`,
    allowing you to use shorthands for common structs. But this was confusingly
    named because it has nothing to do with the `'any'` scalar type. And since it
    was redundant it has been removed.

## [0.7.0]

### Changed

- **BREAKING:** The build process now outputs ES5 code.
  - Previously it was outputting ES6 code, which posed problems for some builders.
    This change shouldn't really affect anyone negatively, but it's being released as
    a breaking version just in case.

## [0.6.0]

### Changed

- **BREAKING:** Invalid `Date` objects are now considered invalid.
  - Previously using the built-in `'date'` validator would only check that the object
    was a `Date` instance, and not that it was a valid one. This has been fixed, and
    although it is technically a breaking change, most everyone would have expected
    this behavior to begin with.

## [0.5.0]

### Added

- Errors can now contain reason information.
  - Validator functions can now return string instead of a boolean, denoting the
    reason a value was invalid. This can then be used to create more helpful
    error messages.

### Changed

- **BREAKING:** Validators must now return `true`, `false` or an error reason string.
  - Previously any truthy value would be considered valid. Now you can provide more
    information for the thrown errors by providing a string which will be attached as
    `error.reason`. However, this means that truthy string values now equate to
    invalid, not valid.
- **BREAKING:** Property validators now receive `data` as their second argument.
  - Previously you only had access to the property `value`, but now you also have
    access to the entire object's `data`.

## [0.4.0]

### Added

- Added the `dict`, `enum`, `intersection`, `union` and `tuple` structs.
  - These are all available as `struct.dict`, `struct.enum`, etc.

### Changed

- **BREAKING:** `object` structs are no longer optional-ish.
  - Previously object struct types would not throw if `undefined` was passed and no
    properties were required. This was not only confusing, but complex to maintain.
    Now if you want an object struct to be optional, use the `struct.optional(...)`
    helper.

### Removed

- **Removed the `Struct.default` method.**
  - If you need to get the default value, use the `Struct.validate` or `Struct.assert`
    methods' return value instead.

## [0.3.0]

### Changed

- **BREAKING:** The `validate` method now returns `[ error, result ]`.
  - Previously it only had a single return value, which necessitated extra type
    checking to see if the value was an error or a result. Now you can just
    destructure the array to get either return value, for easier coding.
- **Errors have been simplified, removing "codes".**
  - Previously there were multiple types of errors that were thrown and you could
    differentiate between them with the `error.code` property. But the other
    properties of the error already let you infer the code, so having multiple types
    of errors made for a larger API surface without much benefit.

## [0.2.0]

### Added

- The basic case is now `Struct(data)`.
  - Previously you had to use `Struct.assert(data)`. Although the `assert` method (and
    others) are still there, the basic case is a bit terser and more similar to the
    struct-initializing APIs in other languages.

### Changed

- **BREAKING:** Structs are now functions again.
  - They are built on the same underlying schema classes underneath though, since that
    helps the code structure. But to allow for the `struct = Struct({ ... })` syntax
    the structs themselves have changed to be function.

## [0.1.0]

### Changed

- **BREAKING:** Structs are now classes instead of functions.
  - This is better in terms of the API being a bit less magic-y. It's also useful so
    that we can add other helpful methods to structs besides the `assert` method. What
    was previously `struct(data)` is now `struct.assert(data)`.

## [0.0.1]

### Added

- Initial release.

[Unreleased]: https://github.com/MetaMask/superstruct/compare/v3.0.0...HEAD
[3.0.0]: https://github.com/MetaMask/superstruct/compare/v2.0.0...v3.0.0
[2.0.0]: https://github.com/MetaMask/superstruct/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/MetaMask/superstruct/compare/v0.16.0...v1.0.0
[0.16.0]: https://github.com/MetaMask/superstruct/compare/v0.15.0...v0.16.0
[0.15.0]: https://github.com/MetaMask/superstruct/compare/v0.14.0...v0.15.0
[0.14.0]: https://github.com/MetaMask/superstruct/compare/v0.13.0...v0.14.0
[0.13.0]: https://github.com/MetaMask/superstruct/compare/v0.12.0...v0.13.0
[0.12.0]: https://github.com/MetaMask/superstruct/compare/v0.11.0...v0.12.0
[0.11.0]: https://github.com/MetaMask/superstruct/compare/v0.10.0...v0.11.0
[0.10.0]: https://github.com/MetaMask/superstruct/compare/v0.8.0...v0.10.0
[0.8.0]: https://github.com/MetaMask/superstruct/compare/v0.7.0...v0.8.0
[0.7.0]: https://github.com/MetaMask/superstruct/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/MetaMask/superstruct/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/MetaMask/superstruct/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/MetaMask/superstruct/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/MetaMask/superstruct/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/MetaMask/superstruct/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/MetaMask/superstruct/compare/v0.0.1...v0.1.0
[0.0.1]: https://github.com/MetaMask/superstruct/releases/tag/v0.0.1
