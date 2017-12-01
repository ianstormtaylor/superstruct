
import cloneDeep from 'clone-deep'
import typeOf from 'kind-of'

import DEFAULT_TYPES from './default-types'
import StructError from './struct-error'

/**
 * A private string to identify structs by.
 *
 * @type {String}
 */

const IS_STRUCT = '@@__STRUCT__@@'

/**
 * Public properties for struct functions.
 *
 * @type {Array}
 */

const STRUCT_PROPERTIES = [
  'schema',
  'defaults',
  'options',
]

/**
 * Public methods for struct functions.
 *
 * @type {Array}
 */

const STRUCT_METHODS = [
  'assert',
  'default',
  'test',
  'validate',
]

/**
 * The diffrent Kinds of struct schemas.
 *
 * @type {Array}
 */

const STRUCT_KINDS = [
  'scalar',
  'function',
  'object',
  'list',
]

/**
 * Convenience flags for the struct factory.
 *
 * @type {Array}
 */

const STRUCT_FLAGS = [
  'required',
]

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
    }

    /**
     * Assert that a `value` is valid, throwing if not.
     *
     * @param {Any} value
     * @return {Any|StructError}
     */

    assert(value) {
      const [ error, result ] = this.validate(value)
      if (error) throw error
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
      const [ error ] = this.validate(value)
      return !error
    }

    /**
     * Validate a `value`, returning an error or the value with defaults.
     *
     * @param {Any} value
     * @return {Array}
     */

    validate(value) {
      value = this.default(value)
      return [undefined, value]
    }

  }

  /**
   * Function schema.
   *
   * @type {FunctionSchema}
   */

  class FunctionSchema extends Schema {

    /**
     * Create a function schema with `schema`, `defaults` and `options`.
     *
     * @param {Any} schema
     * @param {Any} defaults
     * @param {Object} options
     */

    constructor(schema, defaults, options = {}) {
      super(schema, defaults, options)
      this.type = '<function>'
    }

    /**
     * Validate a `value`, returning an error or the value with defaults.
     *
     * @param {Any} value
     * @return {Array}
     */

    validate(value) {
      const { options, type, schema } = this

      value = this.default(value)

      if (
        (options.required && value === undefined) ||
        (value !== undefined && !schema(value))
      ) {
        const error = new StructError({ type, value, data: value, path: [] })
        return [error]
      }

      return [undefined, value]
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
     * @return {Array}
     */

    validate(value) {
      const { options, type, validators } = this

      value = this.default(value)

      if (
        (options.required && value === undefined) ||
        (value !== undefined && !validators.some(fn => fn(value)))
      ) {
        const error = new StructError({ type, value, data: value, path: [] })
        return [error]
      }

      return [undefined, value]
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
     * Validate a list `value`.
     *
     * @param {Any} value
     * @return {Array}
     */

    validate(value) {
      const { options, elementStruct, valueStruct } = this

      value = this.default(value)
      const [ error ] = valueStruct.validate(value)
      if (error) return [error]

      const errors = []
      const values = []
      const isUndefined = !options.required && value === undefined
      value = isUndefined ? [] : value

      value.forEach((element, index) => {
        const [ e, r ] = elementStruct.validate(element)

        if (e) {
          e.path = [index].concat(e.path)
          e.data = value
          errors.push(e)
          return
        }

        values.push(r)
      })

      if (errors.length) {
        const first = errors[0]
        first.errors = errors
        return [first]
      }

      const ret = isUndefined && !values.length ? undefined : values
      return [undefined, ret]
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

      const propertyStructs = {}

      for (const key in schema) {
        const s = struct(schema[key])
        propertyStructs[key] = s

        if (s.options.required) {
          this.options.required = true
        }
      }

      const type = this.options.required ? 'object' : 'object?'
      const valueStruct = struct(type)

      this.type = type
      this.valueStruct = valueStruct
      this.propertyStructs = propertyStructs
    }

    /**
     * Get the defaulted value, given an initial `value`.
     *
     * @param {Object|Void} value
     * @return {Object|Void}
     */

    default(value) {
      const { defaults } = this
      if (value !== undefined || defaults === undefined) return value
      const defs = typeof defaults === 'function' ? defaults() : cloneDeep(defaults)
      const ret = Object.assign({}, value, defs)
      return ret
    }

    /**
     * Validate a list `value`.
     *
     * @param {Any} value
     * @return {Array}
     */

    validate(value) {
      const { options, propertyStructs, valueStruct } = this

      value = this.default(value)

      const [ error ] = valueStruct.validate(value)
      if (error) return [error]

      const errors = []
      const values = {}
      const isUndefined = !options.required && value === undefined

      value = isUndefined ? {} : value

      const valueKeys = Object.keys(value)
      const schemaKeys = Object.keys(propertyStructs)
      const keys = new Set(valueKeys.concat(schemaKeys))
      const hasKeys = !!valueKeys.length

      keys.forEach((k) => {
        const v = value[k]
        const s = this.propertyStructs[k]

        if (!s) {
          const e = new StructError({ data: value, path: [k], value: v })
          errors.push(e)
          return
        }

        const [ e, r ] = s.validate(v)

        if (e) {
          e.path = [k].concat(e.path)
          e.data = value
          errors.push(e)
          return
        }

        if (k in value) {
          values[k] = r
        }
      })

      if (errors.length) {
        const first = errors[0]
        first.errors = errors
        return [first]
      }

      const ret = isUndefined && !hasKeys ? undefined : values
      return [undefined, ret]
    }

  }

  /**
   * Create a `kind` struct with schema `definition`, `defaults` and `options`.
   *
   * @param {String} kind
   * @param {Function|String|Array|Object} definition
   * @param {Any} defaults
   * @param {Object} options
   * @return {Function}
   */

  function createStruct(kind, definition, defaults, options) {
    if (isStruct(definition)) {
      return definition
    }

    const args = [definition, defaults, options]
    let schema

    if (kind === 'function') {
      schema = new FunctionSchema(...args)
    } else if (kind === 'scalar') {
      schema = new ScalarSchema(...args)
    } else if (kind === 'list') {
      schema = new ListSchema(...args)
    } else if (kind === 'object') {
      schema = new ObjectSchema(...args)
    } else {
      throw new Error(`Unrecognized struct kind: ${kind}`)
    }

    // Define the struct creator function.
    function Struct(data) {
      if (this instanceof Struct) {
        throw new Error('The `Struct` creation function should not be used with the `new` keyword.')
      }

      return schema.assert(data)
    }

    // Add a private property for identifying struct functions.
    Struct[IS_STRUCT] = true

    // Mix in the public struct properties.
    STRUCT_PROPERTIES.forEach((prop) => {
      Struct[prop] = schema[prop]
    })

    // Mix in the public struct methods.
    STRUCT_METHODS.forEach((method) => {
      Struct[method] = (...a) => schema[method](...a)
    })

    return Struct
  }

  /**
   * Define a struct with schema `definition`, `defaults` and `options`.
   *
   * @param {Function|String|Array|Object} definition
   * @param {Any} defaults
   * @param {Object} options
   * @return {Function}
   */

  function struct(definition, defaults, options) {
    if (isStruct(definition)) {
      return definition
    }

    const kind = getKind(definition)
    const Struct = createStruct(kind, definition, defaults, options)
    return Struct
  }

  // Mix in a factory for each kind of struct.
  STRUCT_KINDS.forEach((kind) => {
    struct[kind] = (...args) => createStruct(kind, ...args)
  })

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
 * Get the kind of a struct from its schema `definition`.
 *
 * @param {Any} definition
 * @return {String}
 */

function getKind(definition) {
  switch (typeOf(definition)) {
    case 'function': return 'function'
    case 'string': return 'scalar'
    case 'array': return 'list'
    case 'object': return 'object'
    default: {
      throw new Error(`A struct schema definition must be a string, array or object, but you passed: ${definition}`)
    }
  }
}

/**
 * Export.
 *
 * @type {Function}
 */

export default superstruct
