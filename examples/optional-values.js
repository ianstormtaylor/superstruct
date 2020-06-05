import { assert, object, string, boolean, optional } from 'superstruct'

// Define a struct to validate with.
const User = object({
  name: string(),
  email: string(),
  is_admin: optional(boolean()),
})

// Define data to be validated.
const data = {
  name: 'Jane Smith',
  email: 'jane@example.com',
}

// Validate the data. In this case `is_admin` is optional, so it won't throw.
assert(data, User)
