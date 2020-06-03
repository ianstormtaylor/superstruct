import { assert, object, number, optional, string } from 'superstruct'

// Define a `user` struct.
const User = object({
  id: number(),
  name: string(),
})

// Define an `article` struct, composing the user struct in the article's
// `author` property.
const Article = object({
  id: number(),
  title: string(),
  published_at: date(),
  author: User,
})

// Define data to be validated.
const data = {
  id: 1,
  title: 'Hello, World!',
  published_at: new Date(),
  author: {
    id: 1,
    name: 'Jane Smith',
  },
}

// Validate the data. In this case, the data is valid, so it won't throw.
assert(data, Article)
