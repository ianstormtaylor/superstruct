
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

// StructError: 'Expected the `name` property to be of type "string", but it was `false`.' {
//   code: 'property_invalid',
//   type: 'string',
//   path: ['name'],
//   key: 'name',
//   value: false,
// }
