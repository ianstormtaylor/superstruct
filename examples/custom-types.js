
import { superstruct } from 'superstruct'
import isEmail from 'is-email'
import isUuid from 'is-uuid'
import isUrl from 'is-url'

// Define a `struct` with custom types.
const struct = superstruct({
  types: {
    uuid: v => isUuid.v4(v),
    email: (v) => {
      if (!isEmail(v)) return `not_email`
      if (v.length >= 256) return 'too_long'
      return true
    },
    url: v => isUrl(v) && v.length < 2048,
  }
})

// Define a struct to validate with.
const User = struct({
  id: 'uuid',
  name: 'string',
  email: 'email',
  website: 'url?',
})

// Define data to be validated.
const data = {
  id: 'c8d63140-a1f7-45e0-bfc6-df72973fea86',
  name: 'Jane Smith',
  email: 'jane@example.com',
  website: 'https://jane.example.com',
}

// Validate the data. In this case, the data is valid, so it won't throw.
try {
  User(data)
  console.log('Valid!')
} catch (e) {
  throw e
}

// 'Valid!'
