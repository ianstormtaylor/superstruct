
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
  switch (e.code) {
    case 'property_invalid': {
      const error = new Error(`user_${e.key}_invalid`)
      error.attribute = e.key
      error.value = e.value
      throw error
    }
    case 'property_required': {
      const error = new Error(`user_${e.key}_required`)
      error.attribute = e.key
      throw error
    }
    case 'property_unknown': {
      const error = new Error(`user_attribute_unknown`)
      error.attribute = e.key
      throw error
    }
    default: {
      throw e
    }
  }
}

// Error: 'user_name_invalid' {
//   attribute: 'name',
//   value: false,
// }
