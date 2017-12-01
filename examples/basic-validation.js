
import { struct } from 'superstruct'

// Define a struct to validate with.
const User = struct({
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

// Validate the data. In this case, the data is valid, so it won't throw.
try {
  User(data)
  console.log('Valid!')
} catch (e) {
  throw e
}

// 'Valid!'
