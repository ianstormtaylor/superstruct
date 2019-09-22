/**
 * Define a struct error.
 *
 * @type {StructError}
 */

class StructError extends TypeError {
  constructor({ data, path, value, reason, type, errors = [] }) {
    const message = `Expected a value of type \`${type}\`${
      path.length ? ` for \`${path.join('.')}\`` : ''
    } but received \`${JSON.stringify(value)}\`.`

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

/**
 * Export.
 *
 * @type {StructError}
 */

export default StructError
