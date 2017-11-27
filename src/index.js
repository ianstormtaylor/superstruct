
import cloneDeep from 'lodash/cloneDeep'
import typeOf from 'component-type'

import DEFAULT_TYPES from './types'

import {
  ElementInvalidError,
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
        throw new ValueRequiredError({ type })
      }

      if (value !== undefined && !fns.some(fn => fn(value))) {
        throw new ValueInvalidError({ type, value })
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
        throw new ValueRequiredError({ type })
      } else if (typeOf(value) !== 'array') {
        throw new ValueInvalidError({ type, value })
      }

      const ret = value.map((v, index) => {
        try {
          return fn(v)
        } catch (e) {
          const path = [index].concat(e.path)

          switch (e.code) {
            case 'value_invalid':
              throw new ElementInvalidError({ ...e, index, path })
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
        throw new ValueInvalidError({ type, value })
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
              throw new PropertyInvalidError({ ...e, key, path })
            case 'value_required':
              throw isUndefined
                ? new ValueRequiredError({ type })
                : new PropertyRequiredError({ ...e, key, path })
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
          throw new PropertyUnknownError({ key, path: [key] })
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
export { struct, superstruct }
