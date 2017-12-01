
import cloneDeep from 'clone-deep'
import kindOf from 'kind-of'
import invariant from 'invariant'

import StructError from './error'

/**
 * Schema.
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
    return this.check(value)
  }

}

/**
 * Function schema.
 *
 * @type {FunctionSchema}
 */

class FunctionSchema extends Schema {

  constructor(schema, defaults, options = {}) {
    super(schema, defaults, options)

    const type = '<function>'

    this.kind = 'Function'
    this.type = type
    this.check = (value) => {
      if (
        (options.required && value === undefined) ||
        (value !== undefined && !schema(value))
      ) {
        const error = new StructError({ type, value, data: value })
        return [error]
      }

      return [undefined, value]
    }
  }

}

/**
 * Scalar schema.
 *
 * @type {ScalarSchema}
 */

class ScalarSchema extends Schema {

  constructor(schema, defaults, options = {}) {
    super(schema, defaults, options)

    const { types } = options
    const required = !schema.endsWith('?')
    const type = required ? schema : schema.slice(0, -1)
    const ts = type.split(/\s*\|\s*/g)
    const validators = ts.map((t) => {
      const fn = types[t]
      invariant(typeof fn === 'function', `No struct validator function found for type "${t}".`)
      return fn
    })

    this.kind = 'Scalar'
    this.type = type
    this.options.required = required
    this.check = (value) => {
      if (
        (options.required && value === undefined) ||
        (value !== undefined && !validators.some(fn => fn(value)))
      ) {
        const error = new StructError({ type, value, data: value })
        return [error]
      }

      return [undefined, value]
    }
  }

}

/**
 * List schema.
 *
 * @type {ListSchema}
 */

class ListSchema extends Schema {

  constructor(schema, defaults, options = {}) {
    super(schema, defaults, options)

    invariant(schema.length === 1, `List structs must be defined as an array with a single element, but you passed ${schema.length} elements.`)

    const { struct } = options
    const type = options.required ? 'array' : 'array?'
    const valueStruct = struct(type)
    const elementStruct = struct(schema[0])

    this.kind = 'List'
    this.type = type
    this.check = (value) => {
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

    invariant(kindOf(schema) === 'object', `Object structs must be defined as an object, but you passed: ${schema}`)

    const { struct } = options
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

    this.kind = 'Object'
    this.type = type
    this.check = (value) => {
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
        const s = propertyStructs[k]

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

}

/**
 * Export.
 *
 * @type {Function}
 */

export default {
  Function: FunctionSchema,
  List: ListSchema,
  Object: ObjectSchema,
  Scalar: ScalarSchema,
}
