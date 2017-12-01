
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

// Validate the data. In this case the `name` property is invalid, so an error
// will be thrown that you can catch and customize to your needs.
try {
  User(data)
  console.log('Valid!')
} catch (e) {
  const { path, value, type } = e
  const key = path[0]

  if (value === undefined) {
    const error = new Error(`user_${key}_required`)
    error.attribute = key
    throw error
  }

  if (type === undefined) {
    const error = new Error(`user_attribute_unknown`)
    error.attribute = key
    throw error
  }

  const error = new Error(`user_${key}_invalid`)
  error.attribute = key
  error.value = value
  throw error
}

// Error: 'user_name_invalid' {
//   attribute: 'name',
//   value: false,
// }
