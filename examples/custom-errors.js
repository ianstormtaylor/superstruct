/* eslint-disable no-console */

import struct from '..'

// Define a struct to validate with.
const validate = struct({
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

// Validate the data by calling `validate`. In this case the
// `name` property is invalid, so an error will be thrown that
// you can catch and customize to your needs.
try {
  validate(data)
  console.log('Valid!')
} catch (e) {
  switch (e.code) {
    case 'property_invalid': {
      const err = new Error(`user_${e.key}_invalid`)
      err.attribute = e.key
      err.value = e.value
      throw err
    }
    case 'property_required': {
      const err = new Error(`user_${e.key}_required`)
      err.attribute = e.key
      throw err
    }
    case 'property_unknown': {
      const err = new Error(`user_attribute_unknown`)
      err.attribute = e.key
      throw err
    }
  }
}

// Error: 'user_name_invalid' {
//   attribute: 'name',
//   value: false,
// }
