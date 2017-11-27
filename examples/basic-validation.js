/* eslint-disable no-console */

import struct from '..'

// Define a struct to validate with.
const validate = struct({
  id: 'number',
  name: 'string',
  email: 'string',
  age: 'number',
  departments: ['string'],
  is_admin: 'boolean?',
})

// Define data to be validated.
const data = {
  id: 1,
  name: 'Jane Smith',
  email: 'jane@example.com',
  age: 42,
  departments: ['engineering', 'product'],
}

// Validate the data by calling `validate`. In this case, the data is valid, so
// it will not throw.
try {
  validate(data)
  console.log('Valid!')
} catch (e) {
  throw e
}

// 'Valid!'
