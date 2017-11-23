
import cloneDeep from 'lodash/cloneDeep'
import is from 'is'

import TYPES from './types'

import {
  PropertyInvalidError,
  PropertyRequiredError,
  PropertyUnknownError,
  ValueInvalidError,
  ValueRequiredError,
} from './errors'


/**
 * Create a struct factory from a set of `options`.
 *
 * @param {Object} options
 * @return {Function}
 */

function createStruct(options = {}) {
  const { types = {}} = options

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
    const fn = types[type] || TYPES[type]

    if (typeof fn !== 'function') {
      throw new Error(`No struct validator found for scalar of type: "${type}"`)
    }

    return (value) => {
      value = toValue(value, defaults)

      if (!isOptional && value === undefined) {
        throw new ValueRequiredError({ schema })
      }

      if (value !== undefined && !fn(value)) {
        throw new ValueInvalidError({ value, schema })
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
      throw new Error(`List structs must be defined as an array with a single element, but you passed: ${schema.length} elements.`)
    }

    const def = JSON.stringify(schema)
    schema = schema[0]
    const fn = struct(schema)

    return (value) => {
      value = toValue(value, defaults)

      if (!is.array(value)) {
        throw new ValueInvalidError({ value, schema: def })
      }

      const ret = value.map((v, i) => {
        try {
          return fn(v)
        } catch (e) {
          const path = [i].concat(e.path)
          e.path = path
          throw e
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
    const def = JSON.stringify(schema)
    const structs = {}

    for (const key in schema) {
      const fn = struct(schema[key])
      structs[key] = fn
    }

    return (value) => {
      value = toValue(value, defaults)

      if (!is.object(value)) {
        throw new ValueInvalidError({ value, schema: def })
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
              throw new PropertyInvalidError({ schema: e.schema, path, key, value: e.value })
            case 'value_required':
              throw new PropertyRequiredError({ schema: e.schema, path, key })
            default:
              e.path = path
              throw e
          }
        }

        if (key in value) {
          ret[key] = r
        }
      }

      for (const key in value) {
        if (!(key in structs)) {
          const path = [key]
          throw new PropertyUnknownError({ key, path, schema: def })
        }
      }

      return ret
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

    if (is.string(schema)) {
      s = scalarStruct(schema, defaults)
    } else if (is.array(schema)) {
      s = listStruct(schema, defaults)
    } else if (is.object(schema)) {
      s = objectStruct(schema, defaults)
    } else {
      throw new Error(`A struct schema definition must be a string, array or object, but you passed: ${schema}.`)
    }

    return s
  }

  /**
   * Return the struct factory.
   */

  return struct
}

/**
 * Resolve a `defaults` and a `value` into a value.
 *
 * @param {Any} value
 * @param {Any} defaults
 * @return {Any}
 */

function toValue(value, defaults) {
  if (value !== undefined) return value
  if (typeof defaults === 'function') return defaults()
  return cloneDeep(defaults)
}

/**
 * Export the factory and the factory creator.
 *
 * @type {Function}
 */

export default createStruct()
export { createStruct }
