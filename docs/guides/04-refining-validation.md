# Refining Validation

There are some cases where you want to create a validation that is more fine-grained than a "type". For example, you might want not just a `string`, but a specific format of string. Or not just a `User`, but a user that is also an administrator.

For these situations, you can use "refinements". Refinments allow you to create a new struct that is derived from an exsisting struct with an extra bit of validation layered on top.

## Built-in Refinements

Superstruct has several [built-in refinements](../reference/refinements.md) for common use cases. For example, a common one is ensuring that a string matches a specific regular expression pattern:

```ts
import { pattern } from 'superstruct'

const Section = pattern(string(), /\d+(\.\d+/)?/)

assert('2', Section) // passes
assert('2.1', Section) // passes
assert('string', Section) // throws!
```

Or maybe that a string (or array, number, etc.) has a specific size:

```ts
import { size } from 'superstruct'

const Name = size(string(), 1, 100)

assert('Alex', Name) // passes
assert('', Name) // throws!
```

Another common use case is validating nonnegative integers (like indexes in an array) using the built-in `min` helper:

```ts
import { min, integer } from 'superstruct'

const Index = min(integer(), 0)

assert(42, Index) // passes
assert(0, Index) // passes
assert(3.14, Index) // throws!
assert(-1, Index) // throws!
```

These refinements don't change the inferred type of the data, but they do ensure that a slightly stricter validation is enforced at runtime.

## Custom Refinments

You can also write your own custom refinements for more domain-specific use cases. For example, for a specific kind of string:

```ts
import { refine } from 'superstruct'

const MyString = refine(string(), 'MyString', value => {
  return value.startsWith('The') && value.length > 20)
})
```

Now the `MyString` will only validate strings that begin with "The" and are longer than 20 characters.

And whenever an error is thrown from the refinements, the `error.refinement` property will tell you which refinement was the cause.
