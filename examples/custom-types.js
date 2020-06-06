import { object, string, optional, struct, assert } from 'superstruct'
import isEmail from 'is-email'
import isUuid from 'is-uuid'
import isUrl from 'is-url'

// Define custom structs with validation functions.
const Uuid = struct('Uuid', isUuid.v4)

const Url = struct('Url', (value) => {
  return isUrl(value) && value.length < 2048
})

const Email = struct('Email', (value, context) => {
  if (!isEmail(value)) {
    return [context.fail({ code: 'not_email' })]
  } else if (value.length >= 256) {
    return [context.fail({ code: 'too_long' })]
  } else {
    return []
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
