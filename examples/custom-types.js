/* eslint-disable no-console */

import { superstruct } from '..'
import isEmail from 'is-email'
import isUuid from 'is-uuid'
import isUrl from 'is-url'

// Define a `struct` with custom types.
const struct = superstruct({
  types: {
    uuid: v => isUuid.v4(v),
    email: v => isEmail(v) && v.length < 256,
    url: v => isUrl(v) && v.length < 2048,
  }
})

// Define a struct which returns a `validate` function.
const validate = struct({
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

// Validate the data by calling `validate`. In this case, the data is valid, so
// it will not throw.
try {
  validate(data)
  console.log('Valid!')
} catch (e) {
  throw e
}

// 'Valid!'
