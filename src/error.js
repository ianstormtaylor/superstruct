
/**
 * Define a struct error.
 *
 * @type {StructError}
 */

class StructError extends TypeError {

  static format(attrs) {
    const { type, path, value } = attrs
    const message = `Expected a value of type \`${type}\`${path.length ? ` for \`${path.join('.')}\`` : ''} but received \`${JSON.stringify(value)}\`.`
    return message
  }

  constructor(attrs) {
    const message = StructError.format(attrs)
    super(message)

    const { data, path, value, reason, type, errors = [] } = attrs
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
      this.stack = (new Error()).stack
    }
  }

}

/**
 * Export.
 *
 * @type {StructError}
 */

export default StructError
