
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

  constructor({ type, key, value, path = [] }) {
    const message = `The \`${key}\` property in an object was invalid. It should be of type "${type}", but it was: ${value}`
    const code = 'property_invalid'
    super(message, { code, type, path, key, value })
    Error.captureStackTrace(this, this.constructor)
  }

}

class PropertyRequiredError extends StructError {

  constructor({ type, key, path = [] }) {
    const message = `The \`${key}\` property is required but was not defined. It should be of type "${type}".`
    const code = 'property_required'
    super(message, { code, type, path, key })
    Error.captureStackTrace(this, this.constructor)
  }

}

class PropertyUnknownError extends StructError {

  constructor({ key, path = [] }) {
    const message = `The \`${key}\` property in an object was not recognized.`
    const code = 'property_unknown'
    super(message, { code, path, key })
    Error.captureStackTrace(this, this.constructor)
  }

}

class ValueInvalidError extends StructError {

  constructor({ type, value, path = [] }) {
    const message = `Expected the value "${value}" to match type "${type}".`
    const code = 'value_invalid'
    super(message, { code, type, path, value })
    Error.captureStackTrace(this, this.constructor)
  }

}

class ValueRequiredError extends StructError {

  constructor({ type, path = [] }) {
    const message = `A required property was not defined. It should be of type "${type}".`
    const code = 'value_required'
    super(message, { code, type, path })
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

