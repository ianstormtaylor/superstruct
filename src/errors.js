
/**
 * Define a base error class to extend.
 *
 * @type {StructError}
 */

class StructError extends Error {

  constructor(message, data) {
    super(message)
    this.name = 'StructError'

    for (const key in data) {
      this[key] = data[key]
    }

    Error.captureStackTrace(this, this.constructor)
  }

}

/**
 * Define specific errors.
 *
 * @type {StructError}
 */

class PropertyInvalidError extends StructError {

  constructor({ schema, key, value, path = [] }) {
    const message = `The \`${key}\` property in an object was invalid. It should have matched the struct "${schema}". The property in question was: ${value}`
    const code = 'property_invalid'
    super(message, { code, schema, path, key, value })
    Error.captureStackTrace(this, this.constructor)
  }

}

class PropertyRequiredError extends StructError {

  constructor({ schema, key, path = [] }) {
    const message = `The \`${key}\` property is required. It should have matched the struct "${schema}".`
    const code = 'property_required'
    super(message, { code, schema, path, key })
    Error.captureStackTrace(this, this.constructor)
  }

}

class PropertyUnknownError extends StructError {

  constructor({ schema, key, path = [] }) {
    const message = `The \`${key}\` property in an object was not recognized. It did not appear in the struct "${schema}".`
    const code = 'property_unknown'
    super(message, { code, schema, path, key })
    Error.captureStackTrace(this, this.constructor)
  }

}

class ValueInvalidError extends StructError {

  constructor({ schema, value, path = [] }) {
    const message = `Expected the value "${value}" to match schema "${schema}".`
    const code = 'value_invalid'
    super(message, { code, schema, path, value })
    Error.captureStackTrace(this, this.constructor)
  }

}

class ValueRequiredError extends StructError {

  constructor({ schema, path = [] }) {
    const message = `Missing required value to match schema "${schema}".`
    const code = 'value_required'
    super(message, { code, schema, path })
    Error.captureStackTrace(this, this.constructor)
  }

}

/**
 * Export.
 *
 * @type {Object}
 */

export {
  PropertyInvalidError,
  PropertyRequiredError,
  PropertyUnknownError,
  ValueInvalidError,
  ValueRequiredError,
}

