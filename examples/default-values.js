
import { struct } from 'superstruct'

// Define an auto-incrementing unique id.
let uid = 1

// Define a struct to validate with.
const User = struct({
  id: 'number',
  name: 'string',
  email: 'string',
  age: 'number',
  is_admin: 'boolean?',
  created_at: 'date',
}, {
  id: () => uid++,
  is_admin: false,
  age: 0,
  created_at: () => new Date(),
})

// Define data to be validated.
const data = {
  name: 'Jane Smith',
  email: 'jane@example.com',
  age: 42,
}

// Validate the data and store the return value in the `user` variable. Any
// property that wasn't defined will be set to its default.
let user

try {
  user = User(data)
  console.log('Valid!', user)
} catch (e) {
  throw e
}

// 'Valid!' {
//   id: 0,
//   name: 'Jane Smith',
//   email: 'jan@example.com',
//   age: 42,
//   is_admin: false,
//   created_at: Date,
// }
