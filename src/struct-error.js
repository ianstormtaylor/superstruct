
/**
 * Define a struct error.
 *
 * @type {StructError}
 */

class StructError extends TypeError {

  constructor(attrs) {
    const { data, path, value, type } = attrs
    const message = `Expected a value of type "${type}" ${path.length ? `at path \`${path.join('.')}\`` : ''} but received \`${value}\`.`
    super(message)
    this.data = data
    this.path = path
    this.value = value
    this.type = type
    this.errors = [this]
    Error.captureStackTrace(this, this.constructor)
  }

}

/**
 * Export.
 *
 * @type {StructError}
 */

export default StructError
