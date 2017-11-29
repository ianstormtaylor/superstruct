
import cloneDeep from 'lodash/cloneDeep'
import typeOf from 'component-type'

import DEFAULT_TYPES from './default-types'
import StructError from './struct-error'

/**
 * A private string to identify structs by.
 *
 * @type {String}
 */

const IS_STRUCT = '@@__STRUCT__@@'

/**
 * Create a struct factory with a `config`.
 *
 * @param {Object} config
 * @return {Function}
 */

function superstruct(config = {}) {
  const TYPES = {
    ...DEFAULT_TYPES,
    ...(config.types || {}),
  }

  /**
   * Base struct.
   *
   * @type {Struct}
   */

  class Struct {

    /**
     * Create a struct with `schema`, `defaults` and `options`.
     *
     * @param {Any} schema
     * @param {Any} defaults
     */

    constructor(schema, defaults, options = {}) {
      const { required = false } = options
      this.schema = schema
      this.defaults = defaults
      this.required = required
      this.type = null
    }

    /**
     * Get the defaulted value, given an initial `value`.
     *
     * @param {Any} value
     * @return {Any}
     */

    default(value) {
      if (value !== undefined) return value
      const { defaults } = this
      return typeof defaults === 'function' ? defaults() : cloneDeep(defaults)
    }

    /**
     * Validate a `value`, returning an error or the value with defaults.
     *
     * @param {Any} value
     * @return {Any|StructError}
     */

    validate(value) {
      value = this.default(value)
      return value
    }

    /**
     * Assert that a `value` is valid, throwing if not.
     *
     * @param {Any} value
     * @return {Any|StructError}
     */

    assert(value) {
      const result = this.validate(value)

      if (result instanceof StructError) {
        throw result
      }

      return result
    }

  }

  /**
   * Function struct.
   *
   * @type {FunctionStruct}
   */

  class FunctionStruct extends Struct {

    /**
     * Validate a `value`, returning an error or the value with defaults.
     *
     * @param {Any} value
     * @return {Any|StructError}
     */

    validate(value) {
      value = this.default(value)
      const { required, type, schema } = this

      if (required && value === undefined) {
        return new StructError('value_required', { type })
      }

      if (value !== undefined && !schema(value)) {
        return new StructError('value_invalid', { type, value })
      }

      return value
    }

  }

  /**
   * Scalar struct.
   *
   * @type {ScalarStruct}
   */

  class ScalarStruct extends Struct {

    /**
     * Create a scalar struct with `schema`, `defaults` and `options`.
     *
     * @param {Any} schema
     * @param {Any} defaults
     * @param {Object} options
     */

    constructor(schema, defaults, options) {
      super(schema, defaults, options)

      const required = !schema.endsWith('?')
      const type = required ? schema : schema.slice(0, -1)
      const types = type.split(/\s*\|\s*/g)
      const validators = types.map((t) => {
        const fn = TYPES[t]
        if (typeof fn === 'function') return fn
        throw new Error(`No struct validator function found for type "${t}".`)
      })

      this.required = required
      this.type = type
      this.validators = validators
    }

    /**
     * Validate a `value`, returning an error or the value with defaults.
     *
     * @param {Any} value
     * @return {Any|StructError}
     */

    validate(value) {
      value = this.default(value)
      const { required, type, validators } = this

      if (required && value === undefined) {
        return new StructError('value_required', { type })
      }

      if (value !== undefined && !validators.some(fn => fn(value))) {
        return new StructError('value_invalid', { type, value })
      }

      return value
    }

  }

  /**
   * List struct.
   *
   * @type {ListStruct}
   */

  class ListStruct extends Struct {

    /**
     * Create a list struct with `schema`, `defaults` and `options`.
     *
     * @param {Any} schema
     * @param {Any} defaults
     * @param {Object} options
     */

    constructor(schema, defaults, options) {
      super(schema, defaults, options)

      if (schema.length !== 1) {
        throw new Error(`List structs must be defined as an array with a single element, but you passed ${schema.length} elements.`)
      }

      const type = this.required ? 'array' : 'array?'
      const valueStruct = struct(type)
      const elementStruct = struct(schema[0])

      this.type = type
      this.valueStruct = valueStruct
      this.elementStruct = elementStruct
    }

    /**
     * Validate a list `element` at `index`.
     *
     * @param {Number} index
     * @param {Any} element
     * @return {Any|StructError}
     */

    validateElement(index, element) {
      const s = this.elementStruct
      const result = s.validate(element)

      if (result instanceof StructError) {
        const e = result
        const path = [index].concat(e.path)

        if (e.code === 'value_invalid') {
          return new StructError('element_invalid', { ...e, index, path })
        }

        if ('path' in e) e.path = path
        return e
      }

      return result
    }

    /**
     * Validate a list `value`.
     *
     * @param {Any} value
     * @return {Any|StructError}
     */

    validate(value) {
      value = this.default(value)
      const { required, valueStruct } = this
      const result = valueStruct.validate(value)

      if (result instanceof StructError) {
        return result
      }

      const errors = []
      const values = []
      const isUndefined = !required && value === undefined
      value = isUndefined ? [] : value

      value.forEach((e, i) => {
        const r = this.validateElement(i, e)

        if (r instanceof StructError) {
          errors.push(r)
        } else {
          values.push(r)
        }
      })

      if (errors.length) {
        const first = errors[0]
        first.errors = errors
        return first
      }

      return isUndefined && !values.length ? undefined : values
    }

  }

  /**
   * Object struct.
   *
   * @type {ObjectStruct}
   */

  class ObjectStruct extends Struct {

    /**
     * Create an object struct with `schema`, `defaults` and `options`.
     *
     * @param {Any} schema
     * @param {Any} defaults
     * @param {Object} options
     */

    constructor(schema, defaults, options) {
      super(schema, defaults, options)

      const type = this.required ? 'object' : 'object?'
      const valueStruct = struct(type)
      const propertyStructs = {}

      for (const key in schema) {
        const s = struct(schema[key])
        propertyStructs[key] = s
      }

      this.type = type
      this.valueStruct = valueStruct
      this.propertyStructs = propertyStructs
    }

    /**
     * Get the default value for a `key`, given an initial `value`.
     *
     * @param {String} key
     * @param {Any} value
     * @return {Any}
     */

    getProperty(key, value) {
      if (value !== undefined) return value
      const { defaults = {}} = this
      const v = defaults[key]
      return v
    }

    /**
     * Validate a list `element` at `index`.
     *
     * @param {Any} element
     * @param {Number} index
     * @return {Any|StructError}
     */

    validateProperty(key, value) {
      value = this.getProperty(key, value)
      const s = this.propertyStructs[key]

      if (!s) {
        return new StructError('property_unknown', { key, path: [key] })
      }

      const result = s.validate(value)

      if (result instanceof StructError) {
        const error = result
        const path = [key].concat(error.path)

        if (error.code === 'value_invalid') {
          return new StructError('property_invalid', { ...error, key, path })
        }

        if (error.code === 'value_required') {
          return new StructError('property_required', { ...error, key, path })
        }

        if ('path' in error) error.path = path
        return error
      }

      return result
    }

    /**
     * Validate a list `value`.
     *
     * @param {Any} value
     * @return {Any|StructError}
     */

    validate(value) {
      value = this.default(value)
      const { required, propertyStructs, valueStruct } = this
      const result = valueStruct.validate(value)

      if (result instanceof StructError) {
        return result
      }

      const errors = []
      const values = {}
      const isUndefined = !required && value === undefined
      let hasKeys = false
      value = isUndefined ? {} : value

      for (const k in value) {
        hasKeys = true
        const v = value[k]
        const r = this.validateProperty(k, v)

        if (r instanceof StructError) {
          if (r.code === 'property_required' && isUndefined) {
            return new StructError('value_required', { type: 'object' })
          }

          errors.push(r)
        } else {
          values[k] = r
        }
      }

      for (const k in propertyStructs) {
        if (k in values) continue

        const v = value[k]
        const r = this.validateProperty(k, v)

        if (r instanceof StructError) {
          if (r.code === 'property_required' && isUndefined) {
            return new StructError('value_required', { type: 'object' })
          }

          errors.push(r)
        }
      }

      if (errors.length) {
        const first = errors[0]
        first.errors = errors
        return first
      }

      return isUndefined && !hasKeys ? undefined : values
    }

  }

  /**
   * Define a struct with `schema`, `defaults` and `options`.
   *
   * @param {Function|String|Array|Object} schema
   * @param {Any} defaults
   * @param {Object} options
   * @return {Function}
   */

  function struct(schema, defaults, options) {
    const type = typeOf(schema)
    let s

    if (isStruct(schema)) {
      s = schema
    } else if (type === 'function') {
      s = new FunctionStruct(schema, defaults, options)
    } else if (type === 'string') {
      s = new ScalarStruct(schema, defaults, options)
    } else if (type === 'array') {
      s = new ListStruct(schema, defaults, options)
    } else if (type === 'object') {
      s = new ObjectStruct(schema, defaults, options)
    } else {
      throw new Error(`A struct schema definition must be a string, array or object, but you passed: ${schema}`)
    }

    s[IS_STRUCT] = true
    return s
  }

  /**
   * Attach `required` and `optional` convenience methods for easy defining.
   */

  struct.required = (schema, defaults, options = {}) => {
    return struct(schema, defaults, { ...options, required: true })
  }

  struct.optional = (schema, defaults, options = {}) => {
    return struct(schema, defaults, { ...options, required: false })
  }

  /**
   * Return the struct factory.
   */

  return struct
}

/**
 * Check if a `value` is a struct.
 *
 * @param {Any} value
 * @return {Boolean}
 */

function isStruct(value) {
  return !!(value && value[IS_STRUCT])
}

/**
 * Export.
 *
 * @type {Function}
 */

export default superstruct
