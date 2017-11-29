
<p align="center">
  <a href="#"><img src="./docs/images/banner.png" /></a>
</p>

<p align="center">
  A simple and composable way  <br/>
  to validate data in Javascript.
</p>
<br/>
<br/>

<p align="center">
  <a href="#usage">Usage</a> •
  <a href="#why">Why?</a> •
  <a href="#principles">Principles</a> •
  <a href="#examples">Examples</a> •
  <a href="#documentation">Documentation</a>
</p>

<p align="center">
  <a href="https://travis-ci.org/ianstormtaylor/superstruct">
    <img src="https://travis-ci.org/ianstormtaylor/superstruct.svg?branch=master">
  </a> 
  <a href="./packages/superstruct/package.json">
    <img src="https://img.shields.io/npm/v/superstruct.svg?maxAge=3600&label=superstruct&colorB=007ec6&maxAge=3600">
  </a> 
</p>

<br/>
<br/>

Superstruct makes it easy to define interfaces and then validate Javascript data against them. Its type annotation API was inspired by [Typescript](https://www.typescriptlang.org/docs/handbook/basic-types.html), [Flow](https://flow.org/en/docs/types/), [Go](https://gobyexample.com/structs), and [GraphQL](http://graphql.org/learn/schema/), which gives it a familiar, easy to understand API. 

But Superstruct is designed for runtime data validations, so it throws detailed runtime errors for you or your end users. This is especially useful in situations like accepting arbitrary input in a REST or GraphQL API. But it can even be used to validate internal data structures in non-typed code bases.


<br/>

### Usage

Superstruct exports a `struct` factory for creating functions that validate data against a specific schema:

```js
import struct from 'superstruct'

const Article = struct({
  id: 'number',
  title: 'string',
  is_published: 'boolean?',
  tags: ['string'],
  author: {
    id: 'number',
  }
})

const data = {
  id: 34,
  title: 'Hello World',
  is_published: true,
  tags: ['news', 'features'],
  author: {
    id: 1,
  } 
}

// Throws if the data is invalid.
// Returns the data (with defaults) if valid.
Article.assert(data)
```

The schema definition syntax was inspired by [Typescript](https://www.typescriptlang.org/docs/handbook/basic-types.html), [Flow](https://flow.org/en/docs/types/) and [GraphQL](http://graphql.org/learn/schema/), and ships with types for all of the native Javascript types out of the box.

But you can also define your own custom data types—specific to your application's requirements—by using the exported `superstruct` function. For example:

```js
import { superstruct } from 'superstruct'

import isUuid from 'is-uuid'
import isEmail from 'is-email'

const struct = superstruct({
  types: {
    uuid: v => isUuid.v4(v),
    email: v => isEmail(v) && v.length < 256,
  }
})

const User = struct({
  id: 'uuid',
  email: 'email',
  is_admin: 'boolean?',
})

const data = {
  id: 'c8d63140-a1f7-45e0-bfc6-df72973fea86',
  email: 'jane@example.com',
}

User.assert(data)
// Throws if the data is invalid.
// Returns the data (with defaults) if valid.
```


<br/>

### Why?

There are lots of existing validation libraries. Some of them, like [Joi](), [`express-validator`](https://github.com/ctavan/express-validator), [`validator.js`](https://github.com/chriso/validator.js) or [`ajv`](https://github.com/epoberezkin/ajv) are decently popular. But all of them exhibit many issues that lead to hard to maintain codebases...

- **They don't throw errors.** Many validators simply return `true/false` or return string error messages. This was helpful in the days of callbacks, when using `throw` was discouraged, but in modern Javascript using `throw` leads to much simpler and terser code.

- **They don't expose useful error information.** For the validators that do `throw`, they often throw over-simplified, message-only errors without any extra details about the reason the error occurred. This makes it very difficult to customize the errors to make them helpful for end users.

- **They aren't designed around custom types.** Many validators ship with built-in types like emails, URLs, UUIDs, etc. with no easy way to know how they're implemented. And when defining your own custom types—which any reasonably sized codebase needs to do—the APIs are needlessly complex and hard to re-use.

- **They don't encourage single sources of truth.** Many existing APIs encourage re-defining custom data type requirements like maximum lengths, custom types, error messages, etc. over and over, with the source of truth being spread out across many files, which makes consistentcy difficult to maintain.

- **They don't compile schemas for performance.** Some validators allow you to define schemas as plain Javascript objects, which seems nice at first. But it also means that they delegate the complex parsing of the schema logic to validation time, instead of doing the work up front for performance.

- **They are tightly coupled to other concerns.** Many validators are implemented as plugins for Express or other HTTP frameworks, which is completely unnecessary and confusing to reason about. And when you need to validate data elsewhere in your code base you end up with fragmentation.

Of course, not every validation library suffers from all of these issues, but most of them exhibit at least one. If you've run into this problem before, you might like Superstruct.

Which brings me to how Superstruct solves these issues...


<br/>

### Principles

1. **Customizable types.** Superstruct's power is in making it easy to define an entire set of custom data types that are specific to your application, and defined in a _single_ place, so you have full control over your requirements.

2. **Unopinionated defaults.** Superscript ships with native Javascript types, and everything else is customizable, so you never have to fight to override decisions made by "core" that differ from your application's needs.

4. **Composable interfaces.** Superstruct interfaces are composable, so you can break down commonly-repeated pieces of data into components, and compose them to build up the more complex objects.

5. **Terse schemas.** The schemas in Superstruct are designed to be extremely terse. This makes them very easy to read and write, encouraging you to have full data validation coverage.

7. **Compiled validators.** Superstruct does the work of compiling its schemas up front, so that it doesn't have to spend lots of time performing expensive tasks for every call to the validation functions in your hot code paths.

6. **Useful errors.** The errors that Superstruct throws contain all the information you need to convert them into your own application-specific errors easy, which means more helpful errors for your end users!

3. **Familiar API.** The Superstruct API was heavily inspired by [Typescript](https://www.typescriptlang.org/docs/handbook/basic-types.html), [Flow](https://flow.org/en/docs/types/) and [GraphQL](http://graphql.org/learn/schema/). If you're familiar with any of those, then its schema definition API will feel very natural to use, so you can get started quickly.


<br/>

### Examples

Superstruct's API is very flexible, allowing it to be used for a variety of use cases on your servers and in the browser. Here are a few examples of common patterns...

- [Basic Validation](./examples/basic-validation.js)
- [Custom Types](./examples/custom-types.js)
- [Default Values](./examples/default-values.js)
- [Composing Structs](./examples/composing-structs.js)
- [Throwing Errors](./examples/throwing-errors.js)
- [Custom Errors](./examples/custom-errors.js)


<br/>

### Documentation

Read the getting started guide to familiarize yourself with how Superstruct works. After that, check out the full API reference for more detailed information about structs, types and errors...

- [**Guide**](./docs/guide.md)
  - [Installing Superstruct](./docs/guide.md#installing-superstruct)
  - [Creating Structs](./docs/guide.md#creating-structs)
  - [Defining Custom Data Types](./docs/guide.md#defining-custom-data-types)
  - [Setting Default Values](./docs/guide.md#setting-default-values)
  - [Throwing Customized Errors](./docs/guide.md#throwing-customized-errors)
- [**Reference**](./docs/reference.md)
  - [API](./docs/reference.md#api)
  - [Structs](./docs/reference.md#structs)
  - [Types](./docs/reference.md#types)
  - [Errors](./docs/reference.md#errors)


<br/>

### License

This package is [MIT-licensed](./License.md).
