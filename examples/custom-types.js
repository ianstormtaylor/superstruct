import { object, string, optional, define, assert } from 'superstruct'
import isEmail from 'is-email'
import isUuid from 'is-uuid'
import isUrl from 'is-url'

// Define custom structs with validation functions.
const Uuid = define('Uuid', isUuid.v4)

const Url = define('Url', (value) => {
  return isUrl(value) && value.length < 2048
})

const Email = define('Email', (value) => {
  if (!isEmail(value)) {
    return { code: 'not_email' }
  } else if (value.length >= 256) {
    return { code: 'too_long' }
  } else {
    return true
  }
})

// Define a struct to validate with.
const User = object({
  id: Uuid,
  name: string(),
  email: Email,
  website: optional(Url),
})

// Define data to be validated.
const data = {
  id: 'c8d63140-a1f7-45e0-bfc6-df72973fea86',
  name: 'Jane Smith',
  email: 'jane@example.com',
  website: 'https://jane.example.com',
}

// Validate the data. In this case the data is valid, so it won't throw.
assert(data, User)
