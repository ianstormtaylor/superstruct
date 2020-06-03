import {
  object,
  number,
  string,
  boolean,
  date,
  optional,
  assert,
} from 'superstruct'

// Define an auto-incrementing unique id.
let uid = 1

// Define a struct, with optional properties with default values.
const User = object({
  id: optional(number(), () => uid++),
  name: string(),
  email: string(),
  is_admin: optional(boolean(), false),
  created_at: optional(date(), () => new Date()),
})

// Define data to be validated.
const data = {
  name: 'Jane Smith',
  email: 'jane@example.com',
}

// Validate the data and store the return value in the `user` variable. Any
// property that wasn't defined will be set to its default.
const user = assert(data, User, true)
console.log(user)

// {
//   id: 1,
//   name: 'Jane Smith',
//   email: 'jan@example.com',
//   age: 42,
//   is_admin: false,
//   created_at: Date,
// }
