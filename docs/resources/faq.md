# FAQ

Some common questions you might have when first learning Superstruct.

### How can I allow unknown keys with `object` structs?

The [`object`](../reference/types.md#object) struct validates that a value matches a known object shape. Just like it's TypeScript counterpart, it does not allow unknown keys—this is very useful in catching bugs in the majority of cases.

However, there are cases where you'd like to validate a set of properties but ignore any unknown ones. For that you can use the [`type`](../reference/types.md#type) struct which is more generic, and acts similar to TypeScript's structural typing in that it does not care about any extra properties.

### Why not have a built-in `json` struct?

The problem with a built-in `json` struct is that it needs to recursively iterate through deep objects to guarantee they're valid JSON. What's wrong with that? Nothing, except that it would be a footgun.

The cases where you receive a truly unknown object, and you need to validate nothing about its content other than that it is pure JSON are very rare. In those cases, it's not hard to write a `json` utility yourself.

Instead, people would mistakenly use `json` in places where they really meant, "some object I don't care about", without realzing the performance penalty—use [`unknown`](../reference/types.md#unknown) or [`object`](../reference/types.md#object) instead.
