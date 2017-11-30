
import { struct } from 'superstruct'

// Define a struct to validate with.
const User = struct({
  id: 'number',
  name: 'string',
  email: 'string',
})

// Define data to be validated.
const data = {
  id: 1,
  name: true,
  email: 'jane@example.com',
}

// Validate the data. In this case the `name` property is invalid, so a
// `property_invalid` error will be thrown.
try {
  User(data)
} catch (e) {
  throw e
}

// StructError: 'Expected a value of type "string" for `name` but received `false`.' {
//   data: { ... },
//   path: ['name'],
//   value: false,
//   type: 'string',
// }
