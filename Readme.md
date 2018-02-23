<p align="center">
  <a href="#"><img src="./docs/images/banner.png" /></a>
</p>

<p align="center">
  A simple and composable way  <br/>
  to validate data in JavaScript.
</p>
<br/>
<br/>

<p align="center">
  <a href="#usage">Usage</a> •
  <a href="#why">Why?</a> •
  <a href="#principles">Principles</a> •
  <a href="#demo">Demo</a> •
  <a href="#examples">Examples</a> •
  <a href="#documentation">Documentation</a>
</p>

<p align="center">
  <a href="https://travis-ci.org/ianstormtaylor/superstruct">
    <img src="https://travis-ci.org/ianstormtaylor/superstruct.svg?branch=master">
  </a>
  <a href="https://unpkg.com/superstruct/umd/superstruct.min.js">
    <img src="http://img.badgesize.io/https://unpkg.com/superstruct/umd/superstruct.min.js?compression=gzip&amp;label=size&amp;maxAge=300">
  </a>
  <a href="./package.json">
    <img src="https://img.shields.io/npm/v/superstruct.svg?maxAge=300&label=version&colorB=007ec6&maxAge=300">
  </a>
  <a href="./License.md">
    <img src="https://img.shields.io/npm/l/slate.svg?maxAge=300">
  </a>
</p>

<br/>
<br/>

Superstruct makes it easy to define interfaces and then validate JavaScript data against them. Its type annotation API was inspired by [Typescript](https://www.typescriptlang.org/docs/handbook/basic-types.html), [Flow](https://flow.org/en/docs/types/), [Go](https://gobyexample.com/structs), and [GraphQL](http://graphql.org/learn/schema/), giving it a familiar and easy to understand API.

But Superstruct is designed for validating data at runtime, so it throws (or returns) detailed runtime errors for you or your end users. This is especially useful in situations like accepting arbitrary input in a REST or GraphQL API. But it can even be used to validate internal data structures at runtime when needed.

<br/>

### Usage

Superstruct exports a `struct` factory for creating structs that can validate data against a specific schema:

```js
import { struct } from 'superstruct'

const Article = struct({
  id: 'number',
  title: 'string',
  is_published: 'boolean?',
  tags: ['string'],
  author: {
    id: 'number',
  },
})

const data = {
  id: 34,
  title: 'Hello World',
  tags: ['news', 'features'],
  author: {
    id: 1,
  },
}

const article = Article(data)

// This will throw when the data is invalid, and return the data otherwise.
// If you'd rather not throw, use `Struct.validate()` or `Struct.test()`.
```

It recognizes all the native JavaScript types out of the box. But you can also define your own custom data types—specific to your application's requirements—by using the `superstruct` export:

```js
import { superstruct } from 'superstruct'
import isUuid from 'is-uuid'
import isEmail from 'is-email'

const struct = superstruct({
  types: {
    uuid: value => isUuid.v4(value),
    email: value => isEmail(value) && value.length < 256,
  },
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

const user = User(data)
```

Superstruct supports more complex use cases too like defining list or scalar structs, applying default values, composing structs inside each other, returning errors instead of throwing them, etc. For more information read the full [Documentation](#documentation).

<br/>

### Why?

There are lots of existing validation libraries—[`joi`](https://github.com/hapijs/joi), [`express-validator`](https://github.com/ctavan/express-validator), [`validator.js`](https://github.com/chriso/validator.js), [`yup`](https://github.com/jquense/yup), [`ajv`](https://github.com/epoberezkin/ajv), [`is-my-json-valid`](https://github.com/mafintosh/is-my-json-valid)... But they exhibit many issues that lead to your codebase becoming hard to maintain...

* **They don't expose detailed errors.** Many validators simply return string-only errors or booleans without any details as to why, making it difficult to customize the errors to be helpful for end-users.

* **They make custom types hard.** Many validators ship with built-in types like emails, URLs, UUIDs, etc. with no way to know what they check for, and complicated APIs for defining new types.

* **They don't encourage single sources of truth.** Many existing APIs encourage re-defining custom data types over and over, with the source of truth being spread out across your entire code base.

* **They don't throw errors.** Many don't actually throw the errors, forcing you to wrap everywhere. Although helpful in the days of callbacks, not using `throw` in modern JavaScript makes code much more complex.

* **They don't pre-compile schemas.** Many validators define schemas as plain JavaScript objects, which means they delegate the parsing of the schema logic to validation time, making them much slower.

* **They're tightly coupled to other concerns.** Many validators are tightly coupled to Express or other frameworks, which results in one-off, confusing code that isn't reusable across your code base.

* **They use JSON Schema.** Don't get me wrong, JSON Schema _can_ be useful. But it's kind of like HATEOAS—it's usually way more complexity than you need and you aren't using any of its benefits. (Sorry, I said it.)

Of course, not every validation library suffers from all of these issues, but most of them exhibit at least one. If you've run into this problem before, you might like Superstruct.

Which brings me to how Superstruct solves these issues...

<br/>

### Principles

1. **Customizable types.** Superstruct's power is in making it easy to define an entire set of custom data types that are specific to your application, and defined in a _single_ place, so you have full control over your requirements.

2. **Unopinionated defaults.** Superstruct ships with native JavaScript types, and everything else is customizable, so you never have to fight to override decisions made by "core" that differ from your application's needs.

3. **Composable interfaces.** Superstruct interfaces are composable, so you can break down commonly-repeated pieces of data into components, and compose them to build up the more complex objects.

4. **Terse schemas.** The schemas in Superstruct are designed to be extremely terse and expressive. This makes them very easy to read and write, encouraging you to have full data validation coverage.

5. **Compiled validators.** Superstruct does the work of compiling its schemas up front, so that it doesn't spend time performing expensive tasks for every call to the validation functions in your hot code paths.

6. **Useful errors.** The errors that Superstruct throws contain all the information you need to convert them into your own application-specific errors easy, which means more helpful errors for your end users!

7. **Familiar API.** The Superstruct API was heavily inspired by [Typescript](https://www.typescriptlang.org/docs/handbook/basic-types.html), [Flow](https://flow.org/en/docs/types/), [Go](https://gobyexample.com/structs), and [GraphQL](http://graphql.org/learn/schema/). If you're familiar with any of those, then its schema definition API will feel very natural to use, so you can get started quickly.

<br/>

### Demo

Try out the [live demo on JSFiddle](https://jsfiddle.net/yjugaeg8/2/) to get an idea for how the API works, or to quickly verify your use case:

[![Demo screenshot.](./docs/images/demo-screenshot.png)](https://jsfiddle.net/yjugaeg8/2/)

<br/>

### Examples

Superstruct's API is very flexible, allowing it to be used for a variety of use cases on your servers and in the browser. Here are a few examples of common patterns...

* [Basic Validation](./examples/basic-validation.js)
* [Custom Types](./examples/custom-types.js)
* [Default Values](./examples/default-values.js)
* [Optional Values](./examples/optional-values.js)
* [Composing Structs](./examples/composing-structs.js)
* [Throwing Errors](./examples/throwing-errors.js)
* [Returning Errors](./examples/returning-errors.js)
* [Custom Errors](./examples/custom-errors.js)

<br/>

### Documentation

Read the getting started guide to familiarize yourself with how Superstruct works. After that, check out the full API reference for more detailed information about structs, types and errors...

* [**Guide**](./docs/guide.md)
  * [Installing Superstruct](./docs/guide.md#installing-superstruct)
  * [Creating Structs](./docs/guide.md#creating-structs)
  * [Defining Custom Data Types](./docs/guide.md#defining-custom-data-types)
  * [Setting Default Values](./docs/guide.md#setting-default-values)
  * [Throwing Customized Errors](./docs/guide.md#throwing-customized-errors)
  * [Validating Complex Shapes](./docs/guide.md#validating-complex-shapes)
  * [Composing Structs](./docs/guide.md#composing-structs)
* [**Reference**](./docs/reference.md)
  * [API](./docs/reference.md#api)
  * [Structs](./docs/reference.md#structs)
  * [Types](./docs/reference.md#types)
  * [Errors](./docs/reference.md#errors)
* [**Resources**](/docs/resources.md)

<br/>

### License

This package is [MIT-licensed](./License.md).
