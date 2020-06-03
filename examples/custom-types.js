import { object, string, optional, create, assert } from 'superstruct'
import isEmail from 'is-email'
import isUuid from 'is-uuid'
import isUrl from 'is-url'

// Define custom structs with validation functions.
const Uuid = create(value => {
  return isUuid.v4(value) ? [undefined, value] : [{}]
})

const Uuid = create(value => {
  return isUuid.v4(value) ? value : failure()
})

const Email = create(value => {
  if (!isEmail(value)) {
    return [{ code: 'not_email' }]
  } else if (value.length >= 256) {
    return [{ code: 'too_long' }]
  } else {
    return [undefined, value]
  }
})

const Url = create(value => {
  return isUrl(value) && value.length < 2048 ? [undefined, value] : [{}]
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

// Validate the data. In this case, the data is valid, so it won't throw.
assert(data, User)
