
/**
 * Define a struct error.
 *
 * @type {StructError}
 */

class StructError extends TypeError {

  constructor(code, data) {
    data.code = code
    data.path = data.path || []
    const { index, key, value, type } = data
    let message

    switch (code) {
      case 'element_invalid':
        message = `Expected the element at index \`${index}\` to be of type "${type}", but it was \`${value}\`.`
        break
      case 'property_invalid':
      case 'property_required':
        message = `Expected the \`${key}\` property to be of type "${type}", but it was \`${value}\`.`
        break
      case 'property_unknown':
        message = `Unexpected \`${key}\` property that was not defined in the struct.`
        break
      case 'value_invalid':
      case 'value_required':
        message = `Expected a value of type "${type}" but received \`${value}\`.`
        break
      default:
        throw new Error(`Unknown struct error code: "${code}"`)
    }

    super(message)
    this.name = 'StructError'
    this.errors = [this]

    for (const k in data) {
      this[k] = data[k]
    }

    Error.captureStackTrace(this, this.constructor)
  }

}

/**
 * Export.
 *
 * @type {StructError}
 */

export default StructError
