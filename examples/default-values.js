import {
  assert,
  boolean,
  coerce,
  date,
  defaulted,
  number,
  object,
  string,
} from 'superstruct'

// Define an auto-incrementing unique id.
let uid = 1

// Define a struct, with properties with default values.
const User = object({
  id: defaulted(number(), () => uid++),
  name: string(),
  email: string(),
  is_admin: defaulted(boolean(), false),
  created_at: defaulted(date(), () => new Date()),
})

// Define data to be validated.
let data = {
  name: 'Jane Smith',
  email: 'jane@example.com',
}

// Coerce the data using the struct's default values.
data = coerce(data, User)
// {
//   id: 1,
//   name: 'Jane Smith',
//   email: 'jan@example.com',
//   age: 42,
//   is_admin: false,
//   created_at: Date,
// }

// Validate the data. In this case the data is valid once it has had the
// defaults applied, so it won't throw.
assert(data, User)
