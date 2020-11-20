# FAQ

Some common questions you might have when first learning Superstruct.

### Why not have a built-in `json` type?

The problem with a built-in `json()` struct is that it needs to recursively iterate through deep objects to guarantee they're valid JSON. What's wrong with that? Nothing, except that it would be a footgun.

The cases where you receive a truly unknown object, and you need to validate nothing about its content other than that it is pure JSON are very rare. In those cases, it's not hard to write a `json()` utility yourself.

Instead, people would mistakenly use `json()` in places where they really meant, "some object I don't care about", without realzing the performance penalty—use `unknown()` or `object()` instead.
