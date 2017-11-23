
<p align="center">
  <a href="#"><img src="./docs/images/banner.png" /></a>
</p>

<p align="center">
  A simple and composable way  <br/>
  to validate data in Javascript.
</p>
<br/>
<br/>

Superstruct makes it easy to define interfaces and then validate Javascript data against them. Its type annotation API was inspired by [Typescript](https://www.typescriptlang.org/docs/handbook/basic-types.html), [Flow](https://flow.org/en/docs/types/) and [GraphQL](http://graphql.org/learn/schema/). But Superstruct is designed for runtime data validations, for example when accepting input in a REST or GraphQL API.

---

<p align="center">
  <a href="https://www.npmjs.com/package/superstruct">
    <img src="https://img.shields.io/npm/dt/superstruct.svg?maxAge=2592000">
  </a> 
  <a href="https://unpkg.com/superstruct/dist/superstruct.min.js">
    <img src="http://img.badgesize.io/https://unpkg.com/superstruct/dist/superstruct.min.js?compression=gzip&amp;label=superstruct">
  </a>
  <a href="https://travis-ci.org/ianstormtaylor/superstruct">
    <img src="https://travis-ci.org/ianstormtaylor/superstruct.svg?branch=master">
  </a> 
  <a href="./packages/superstruct/package.json">
    <img src="https://img.shields.io/npm/v/superstruct.svg?maxAge=2592000&label=superstruct&colorB=007ec6">
  </a> 
  <a href="./License.md">
    <img src="https://img.shields.io/npm/l/superstruct.svg?maxAge=2592000">
  </a> 
</p>
<br/>

---

<p align="center">
  <a href="#example">Example</a> •
  <a href="#why">Why?</a> •
  <a href="#principles">Principles</a> •
  <a href="#documentation">Documentation</a>
</p>

---

<p align="center">
  <a href="https://www.npmjs.com/package/superstruct">
    <img src="https://img.shields.io/npm/dt/superstruct.svg?maxAge=2592000">
  </a> 
  <a href="https://unpkg.com/superstruct/dist/superstruct.min.js">
    <img src="http://img.badgesize.io/https://unpkg.com/superstruct/dist/superstruct.min.js?compression=gzip&amp;label=superstruct">
  </a>
  <a href="https://travis-ci.org/ianstormtaylor/superstruct">
    <img src="https://travis-ci.org/ianstormtaylor/superstruct.svg?branch=master">
  </a> 
  <a href="./packages/superstruct/package.json">
    <img src="https://img.shields.io/npm/v/superstruct.svg?maxAge=2592000&label=superstruct&colorB=007ec6">
  </a> 
  <a href="./License.md">
    <img src="https://img.shields.io/npm/l/superstruct.svg?maxAge=2592000">
  </a> 
</p>

---

<br/>
<br/>

### Example

Superstruct exports a `struct` factory for creating functions that validate data against a specific schema:

```js
import struct from 'superstruct'

const validate = struct({
  id: 'number',
  title: 'string',
  is_published: 'boolean',
  tags: ['string'],
  author: {
    id: 'number',
  }
})

const data = {
  id: 34,
  title: 'Hello World',
  is_published: true,
  tags: ['announcements'],
  author: {
    id: 1,
  } 
}

validate(data)
// Throws if the data is invalid.
// Returns the data (with defaults) if valid.
```

The schema definition syntax was inspired by [Typescript](https://www.typescriptlang.org/docs/handbook/basic-types.html), [Flow](https://flow.org/en/docs/types/) and [GraphQL](http://graphql.org/learn/schema/).

But you can also define your own types—specific to your application's requirements—by using the exported `superstruct` function. For example:

```js
import { superstruct } from 'superstruct'

import isUuid from 'is-uuid'
import isEmail from 'is-email'

const struct = superstruct({
  types: {
    uuid: v => isUuid.v5(v),
    email: v => isEmail(v) && v.length < 256,
  }
})

const validate = struct({
  id: 'uuid',
  email: 'email',
  is_admin: 'boolean?',
})

const data = {
  id: '5a2de30a-a736-5aea-8f7f-ad0f019cdc00',
  email: 'jane@example.com',
}

validate(data)
// Throws if the data is invalid.
// Returns the data (with defaults) if valid.
```


<br/>

### Why?

There are lots of existing validation libraries. Some of them, like [Joi](), are fairly popular. But most of them exhibit one or many issues...

- **Not throwing the errors.** Many validators simply return `true/false` or return details about the error. This was nice back in the days of callbacks, where throwing was discouraged, but in modern Javascript using `throw` leads to much simpler code.

- **Not making it easy to define custom types.** Lots of the validators ship with built-in types like emails, URLs, UUIDs, etc. But they often don't take into account things like maximum lengths, or But once you need to define your own custom types—which any reasonably sized use case will require—the APIs are complex, and poorly supported.

- **Not having single sources of truth.** Many of the existing APIs encourage re-defining data types like names, emails, or  over and over, with the source of truth being spread out across many files. This leads to 

- **Not treating errors as part of the API.** For the validators that do throw errors, they often throw simple message-only errors without any extra information. This makes it hard to customize the error message to make them helpful for users.

- **Not compiling schemas on creation.** Some validators allow you to define schemas as plain Javascript objects, which seems nice. But then they delegate the more complex parsing and compiling logic to validation time, instead of doing the work up front.

Of course, not every validation library suffers from all of these issues, but most of them exhibit at least one. If you've run into this problem before, you might like Superstruct.

Which brings me to how Superstruct solves these issues...


<br/>

### Principles

1. **Customizable types.** Superstruct's power is in making it easy to define an entire set of custom data types that are specific to your application, so that you have full control over exactly what you're checking for.

2. **Unopinionated defaults.** Superscript only ships with the native Javascript types by default, that you never have to fight to override decisions made by "core" that differ from your application's needs.

4. **Composable interfaces.** Superstruct interfaces are composable, so you can break down commonly-repeated pieces into smaller components, and compose them to make up the more complex.

5. **Terse schemas.** The schemas in Superstruct are designed to be extremely terse. This makes them very easy to read and write, so that you're encouraged to have full data validation coverage.

3. **Familiar API.** The Superstruct API was heavily inspired by Typescript, Flow and GraphQL. If you're familiar with any of those then its schema definition API will feel very natural to use, so you can get started quickly.

6. **Useful errors.** The errors that Superstruct throws contain all the information you need to convert them into your own application-specific errors easy, which means more helpful errors for your end users!

7. **Compiled validators.** Superstruct does the work of compiling its schemas up front, so that it doesn't have to spend lots of time performing expensive tasks for every call to the validation functions in your hot code paths.


<br/>

### Documentation




<br/>

### License

This package is [MIT-licensed](./License.md).
