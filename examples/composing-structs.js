
import { struct } from 'superstruct'

// Define a `user` struct.
const User = struct({
  id: 'number',
  name: 'string',
})

// Define an `article` struct, composing the user struct in the article's
// `author` property.
const Article = struct({
  id: 'number',
  title: 'string',
  created_at: 'date',
  published_at: 'date?',
  author: User,
})

// Define data to be validated.
const data = {
  id: 1,
  title: 'Hello, World!',
  created_at: new Date(),
  author: {
    id: 1,
    name: 'Jane Smith',
  }
}

// Validate the data by calling `validate`. In this case, the data is valid, so
// it will not throw an error.
try {
  Article.assert(data)
  console.log('Valid!')
} catch (e) {
  throw e
}

// 'Valid!'
