
/**
 * Define a struct error.
 *
 * @type {StructError}
 */

class StructError extends TypeError {

  constructor(attrs) {
    super()
    const errors = attrs.errors || []
    this.message = this.constructor.format(attrs)
    this.data = attrs.data
    this.path = attrs.path
    this.value = attrs.value
    this.reason = attrs.reason
    this.type = attrs.type
    this.errors = errors
    if (!errors.length) errors.push(this)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    } else {
      this.stack = (new Error()).stack
    }
  }

  static format(attrs) {
    const path = attrs.path.join('.')
    return `Expected a value of type \`${attrs.type}\`${path.length ? ` for \`${path}\`` : ''} but received \`${JSON.stringify(attrs.value)}\`.`
  }

}

/**
 * Export.
 *
 * @type {StructError}
 */

export default StructError
