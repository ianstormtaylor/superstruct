import { struct, StructError } from 'superstruct'

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

// Validate the data with the `validate` method. In this case the `name`
// property is invalid, so a `property_invalid` error will be returned.
const result = User.validate(data)

if (result instanceof StructError) {
  console.error(result)
} else {
  console.log('Valid!')
}

// StructError: 'Expected a value of type "string" for `name` but received `false`.' {
//   data: { ... },
//   path: ['name'],
//   value: false,
//   type: 'string',
// }
