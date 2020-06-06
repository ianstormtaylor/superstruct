import {
  array,
  assert,
  boolean,
  number,
  object,
  optional,
  string,
} from 'superstruct'

// Define a struct to validate with.
const User = object({
  id: number(),
  name: string(),
  email: string(),
  age: number(),
  departments: array(string()),
  is_admin: optional(boolean()),
})

// Define data to be validated.
const data = {
  id: 1,
  name: 'Jane Smith',
  email: 'jane@example.com',
  age: 42,
  departments: ['engineering', 'product'],
}

// Validate the data. In this case, the data is valid, so it won't throw.
assert(data, User)
