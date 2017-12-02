
/**
 * Define a struct error.
 *
 * @type {StructError}
 */

class StructError extends TypeError {

  constructor(attrs) {
    const { data, value, type, path, errors = [] } = attrs
    const message = `Expected a value of type \`${type}\`${path.length ? ` for \`${path.join('.')}\`` : ''} but received \`${value}\`.`
    super(message)
    this.data = data
    this.path = path
    this.value = value
    this.type = type
    this.errors = errors
    if (!errors.length) errors.push(this)
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
