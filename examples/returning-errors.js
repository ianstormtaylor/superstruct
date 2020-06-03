import { object, number, string, validate } from 'superstruct'

// Define a struct to validate with.
const User = object({
  id: number(),
  name: string(),
  email: string(),
})

// Define data to be validated.
const data = {
  id: 1,
  name: true,
  email: 'jane@example.com',
}

// Validate the data with the `validate` method. In this case the `name`
// property is invalid, so a `property_invalid` error will be returned.
const [error, user] = validate(data, User)

if (error) {
  console.error(error)
} else {
  console.log(user)
}

// StructError: 'Expected a value of type "string" for `name` but received `false`.' {
//   type: 'string',
//   value: false,
//   path: ['name'],
//   branch: [{...}, false],
//   failures: [...],
// }
