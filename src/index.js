
import cloneDeep from 'lodash/cloneDeep'
import typeOf from 'component-type'

/**
 * Default types.
 *
 * @type {Object}
 */

const DEFAULT_TYPES = {
  any: v => v !== undefined,
  array: v => typeOf(v) === 'array',
  boolean: v => typeOf(v) === 'boolean',
  buffer: v => typeOf(v) === 'buffer',
  date: v => typeOf(v) === 'date',
  error: v => typeOf(v) === 'error',
  function: v => typeOf(v) === 'function',
  null: v => typeOf(v) === 'null',
  number: v => typeOf(v) === 'number',
  object: v => typeOf(v) === 'object',
  regexp: v => typeOf(v) === 'regexp',
  string: v => typeOf(v) === 'string',
  undefined: v => typeOf(v) === 'undefined',
}

/**
 * Define a struct error.
 *
 * @type {StructError}
 */

class StructError extends Error {

  constructor(message, data) {
    data.code = message
    data.path = data.path || []
    const { index, key, value, type } = data

    switch (message) {
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
        throw new Error(`Unknown struct error code: "${message}"`)
    }

    super(message)
    this.name = 'StructError'

    for (const k in data) {
      this[k] = data[k]
    }

    Error.captureStackTrace(this, this.constructor)
  }

}

/**
 * Create a struct factory from a set of `options`.
 *
 * @param {Object} options
 * @return {Function}
 */

function superstruct(options = {}) {
  const TYPES = {
    ...DEFAULT_TYPES,
    ...(options.types || {}),
  }

  /**
   * Define a scalar struct with a `schema` type string.
   *
   * @param {String} schema
   * @param {Any} defaults
   * @return {Function}
   */

  function scalarStruct(schema, defaults) {
    const isOptional = schema.endsWith('?')
    const type = isOptional ? schema.slice(0, -1) : schema
    const types = type.split(/\s*\|\s*/g)

    const fns = types.map((t) => {
      const fn = TYPES[t]

      if (typeof fn !== 'function') {
        throw new Error(`No struct validator function found for type "${t}".`)
      }

      return fn
    })

    return (value) => {
      if (!isOptional && value === undefined) {
        throw new StructError('value_required', { type })
      }

      if (value !== undefined && !fns.some(fn => fn(value))) {
        throw new StructError('value_invalid', { type, value })
      }

      return value
    }
  }

  /**
   * Define a list struct with a `schema` array.
   *
   * @param {Array} schema
   * @param {Any} defaults
   * @return {Function}
   */

  function listStruct(schema, defaults) {
    if (schema.length !== 1) {
      throw new Error(`List structs must be defined as an array with a single element, but you passed ${schema.length} elements.`)
    }

    schema = schema[0]
    const fn = struct(schema)
    const type = 'array'

    return (value) => {
      if (value === undefined) {
        throw new StructError('value_required', { type })
      } else if (typeOf(value) !== 'array') {
        throw new StructError('value_invalid', { type, value })
      }

      const ret = value.map((v, index) => {
        try {
          return fn(v)
        } catch (e) {
          const path = [index].concat(e.path)

          switch (e.code) {
            case 'value_invalid':
              throw new StructError('element_invalid', { ...e, index, path })
            default:
              if ('path' in e) e.path = path
              throw e
          }
        }
      })

      return ret
    }
  }

  /**
   * Define an object struct with a `schema` dictionary.
   *
   * @param {Object} schema
   * @param {Any} defaults
   * @return {Function}
   */

  function objectStruct(schema, defaults) {
    const structs = {}
    const type = 'object'

    for (const key in schema) {
      const fn = struct(schema[key])
      structs[key] = fn
    }

    return (value) => {
      let isUndefined = false

      if (value === undefined) {
        isUndefined = true
        value = {}
      } else if (typeOf(value) !== 'object') {
        throw new StructError('value_invalid', { type, value })
      }

      const ret = {}

      for (const key in structs) {
        const s = structs[key]
        const v = value[key]
        let r

        try {
          r = s(v)
        } catch (e) {
          const path = [key].concat(e.path)

          switch (e.code) {
            case 'value_invalid':
              throw new StructError('property_invalid', { ...e, key, path })
            case 'value_required':
              throw isUndefined
                ? new StructError('value_required', { type })
                : new StructError('property_required', { ...e, key, path })
            default:
              if ('path' in e) e.path = path
              throw e
          }
        }

        if (key in value) {
          ret[key] = r
        }
      }

      for (const key in value) {
        if (!(key in structs)) {
          throw new StructError('property_unknown', { key, path: [key] })
        }
      }

      return isUndefined ? undefined : ret
    }
  }

  /**
   * Define a struct with `schema`.
   *
   * @param {Function|String|Array|Object} schema
   * @param {Any} defaults
   * @return {Function}
   */

  function struct(schema, defaults) {
    let s

    if (typeOf(schema) === 'function') {
      s = schema
    } else if (typeOf(schema) === 'string') {
      s = scalarStruct(schema, defaults)
    } else if (typeOf(schema) === 'array') {
      s = listStruct(schema, defaults)
    } else if (typeOf(schema) === 'object') {
      s = objectStruct(schema, defaults)
    } else {
      throw new Error(`A struct schema definition must be a string, array or object, but you passed: ${schema}`)
    }

    return (value) => {
      if (value === undefined) {
        value = typeof defaults === 'function'
          ? defaults()
          : cloneDeep(defaults)
      }

      return s(value)
    }
  }

  /**
   * Return the struct factory.
   */

  return struct
}

/**
 * Export the factory and the factory creator.
 *
 * @type {Function}
 */

const struct = superstruct()

export default struct
export { struct, superstruct, StructError }
