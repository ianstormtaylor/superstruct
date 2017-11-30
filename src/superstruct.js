
import cloneDeep from 'lodash.clonedeep'
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
 * Public methods for struct functions.
 *
 * @type {Array}
 */

const STRUCT_METHODS = [
  'assert',
  'default',
  'defaultProperty',
  'mask',
  'test',
  'validate',
  'validateElement',
  'validateProperty',
]

/**
 * Convenience flags for the struct factory.
 *
 * @type {Array}
 */

const STRUCT_FLAGS = [
  'required',
  'unsealed',
]

/**
 * The error codes that structs can throw.
 *
 * @type {String}
 */

const ELEMENT_INVALID = 'element_invalid'
const PROPERTY_INVALID = 'property_invalid'
const PROPERTY_REQUIRED = 'property_required'
const PROPERTY_UNKNOWN = 'property_unknown'
const VALUE_INVALID = 'value_invalid'
const VALUE_REQUIRED = 'value_required'

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
   * Base schema.
   *
   * @type {Schema}
   */

  class Schema {

    /**
     * Create a schema with `schema`, `defaults` and `options`.
     *
     * @param {Any} schema
     * @param {Any} defaults
     * @param {Object} options
     */

    constructor(schema, defaults, options = {}) {
      this.schema = schema
      this.defaults = defaults
      this.options = options
      this.type = null
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
     * Test that a `value` is valid.
     *
     * @param {Any} value
     * @return {Boolean}
     */

    test(value) {
      const result = this.validate(value)
      return !(result instanceof StructError)
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

  }

  /**
   * Function schema.
   *
   * @type {FunctionSchema}
   */

  class FunctionSchema extends Schema {

    /**
     * Validate a `value`, returning an error or the value with defaults.
     *
     * @param {Any} value
     * @return {Any|StructError}
     */

    validate(value) {
      const { options, type, schema } = this

      value = this.default(value)

      if (options.required && value === undefined) {
        return new StructError(VALUE_REQUIRED, { type })
      }

      if (value !== undefined && !schema(value)) {
        return new StructError(VALUE_INVALID, { type, value })
      }

      return value
    }

  }

  /**
   * Scalar schema.
   *
   * @type {ScalarSchema}
   */

  class ScalarSchema extends Schema {

    /**
     * Create a scalar schema with `schema`, `defaults` and `options`.
     *
     * @param {Any} schema
     * @param {Any} defaults
     * @param {Object} options
     */

    constructor(schema, defaults, options = {}) {
      super(schema, defaults, options)

      const required = !schema.endsWith('?')
      const type = required ? schema : schema.slice(0, -1)
      const types = type.split(/\s*\|\s*/g)
      const validators = types.map((t) => {
        const fn = TYPES[t]
        if (typeof fn === 'function') return fn
        throw new Error(`No struct validator function found for type "${t}".`)
      })

      this.options.required = required
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
      const { options, type, validators } = this

      value = this.default(value)

      if (options.required && value === undefined) {
        return new StructError(VALUE_REQUIRED, { type })
      }

      if (value !== undefined && !validators.some(fn => fn(value))) {
        return new StructError(VALUE_INVALID, { type, value })
      }

      return value
    }

  }

  /**
   * List schema.
   *
   * @type {ListSchema}
   */

  class ListSchema extends Schema {

    /**
     * Create a list schema with `schema`, `defaults` and `options`.
     *
     * @param {Any} schema
     * @param {Any} defaults
     * @param {Object} options
     */

    constructor(schema, defaults, options = {}) {
      super(schema, defaults, options)

      if (schema.length !== 1) {
        throw new Error(`List structs must be defined as an array with a single element, but you passed ${schema.length} elements.`)
      }

      const type = options.required ? 'array' : 'array?'
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

        if (e.code === VALUE_INVALID) {
          return new StructError(ELEMENT_INVALID, { ...e, index, path })
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
      const { options, valueStruct } = this

      value = this.default(value)
      const result = valueStruct.validate(value)

      if (result instanceof StructError) {
        return result
      }

      const errors = []
      const values = []
      const isUndefined = !options.required && value === undefined
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
   * Object schema.
   *
   * @type {ObjectSchema}
   */

  class ObjectSchema extends Schema {

    /**
     * Create an object schema with `schema`, `defaults` and `options`.
     *
     * @param {Any} schema
     * @param {Any} defaults
     * @param {Object} options
     */

    constructor(schema, defaults, options = {}) {
      super(schema, defaults, options)

      const type = options.required ? 'object' : 'object?'
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

    defaultProperty(key, value) {
      if (value !== undefined) return value
      const { defaults = {}} = this
      const v = defaults[key]
      return v
    }

    /**
     * Mask the properties a `value`, returning only the known ones.
     *
     * @param {Function} Struct
     * @param {Object} value
     */

    mask(value) {
      if (value === undefined) {
        return undefined
      }

      const { schema } = this
      const ret = {}

      for (const key in schema) {
        if (key in value) ret[key] = value[key]
      }

      return ret
    }

    /**
     * Validate a list `element` at `index`.
     *
     * @param {Any} element
     * @param {Number} index
     * @return {Any|StructError}
     */

    validateProperty(key, value) {
      const s = this.propertyStructs[key]

      value = this.defaultProperty(key, value)

      if (!s) {
        return new StructError(PROPERTY_UNKNOWN, { key, path: [key] })
      }

      const result = s.validate(value)

      if (result instanceof StructError) {
        const error = result
        const path = [key].concat(error.path)

        if (error.code === VALUE_INVALID) {
          return new StructError(PROPERTY_INVALID, { ...error, key, path })
        }

        if (error.code === VALUE_REQUIRED) {
          return new StructError(PROPERTY_REQUIRED, { ...error, key, path })
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
      const { options, propertyStructs, valueStruct } = this

      value = this.default(value)

      if (options.unsealed) {
        value = this.mask(value)
      }

      const result = valueStruct.validate(value)

      if (result instanceof StructError) {
        return result
      }

      const errors = []
      const values = {}
      const isUndefined = !options.required && value === undefined
      let hasKeys = false
      value = isUndefined ? {} : value

      for (const k in value) {
        hasKeys = true
        const v = value[k]
        const r = this.validateProperty(k, v)

        if (r instanceof StructError) {
          if (r.code === PROPERTY_REQUIRED && isUndefined) {
            return new StructError(VALUE_REQUIRED, { type: 'object' })
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
          if (r.code === PROPERTY_REQUIRED && isUndefined) {
            return new StructError(VALUE_REQUIRED, { type: 'object' })
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

  function struct(schema, defaults, options = {}) {
    if (isStruct(schema)) {
      return schema
    }

    const type = typeOf(schema)
    const args = [schema, defaults, options]
    let sch

    if (type === 'function') {
      sch = new FunctionSchema(...args)
    } else if (type === 'string') {
      sch = new ScalarSchema(...args)
    } else if (type === 'array') {
      sch = new ListSchema(...args)
    } else if (type === 'object') {
      sch = new ObjectSchema(...args)
    } else {
      throw new Error(`A struct schema definition must be a string, array or object, but you passed: ${schema}`)
    }

    // Define the struct creator function.
    function Struct(data) {
      if (this instanceof Struct) {
        throw new Error('The `Struct` creation function should not be used with the `new` keyword.')
      }

      return sch.assert(data)
    }

    // Add a private property for identifying struct functions.
    Struct[IS_STRUCT] = true

    // Mix in all of the methods for this kind of schema.
    STRUCT_METHODS.forEach((method) => {
      if (sch[method]) {
        Struct[method] = (...a) => sch[method](...a)
      }
    })

    return Struct
  }

  // Mix in the convenience properties for option flags.
  STRUCT_FLAGS.forEach((flag) => {
    Object.defineProperty(struct, flag, {
      get: () => (s, d, o = {}) => struct(s, d, { ...o, [flag]: true })
    })
  })

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
