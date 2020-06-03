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

// Validate the data and store the return value in the `user` variable. Here
// the `is_admin` property is optional, so it won't throw.
assert(data, User)
