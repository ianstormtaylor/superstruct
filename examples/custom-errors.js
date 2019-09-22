import { superstruct } from 'superstruct'

class CustomError extends TypeError {
  constructor({ data, path, value, reason, type, errors = [] }) {
    const message = `This is a custom error.`

    super(message)

    this.data = data
    this.path = path
    this.value = value
    this.reason = reason
    this.type = type
    this.errors = errors

    if (!errors.length) {
      errors.push(this)
    }

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    } else {
      this.stack = new Error().stack
    }
  }
}

// Define the CustomError with the superstruct factory
const struct = superstruct({
  error: CustomError,
})

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

// Validate the data. In this case the `name` property is invalid, 
// so the CustomError will be thrown.

User(data)

// Error: This is a custom error.
