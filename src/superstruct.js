
import kindOf from 'kind-of'

import TYPES from './types'
import Schemas from './schemas'

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
  'kind',
  'type',
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
 * Create a struct factory with a `config`.
 *
 * @param {Object} config
 * @return {Function}
 */

function superstruct(config = {}) {
  const types = {
    ...TYPES,
    ...(config.types || {}),
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

  function createStruct(kind, definition, defaults, options = {}) {
    if (isStruct(definition)) {
      definition = definition.schema
    }

    const Schema = Schemas[kind]
    const schema = new Schema(definition, defaults, { ...options, types, struct })

    // Define the struct creator function.
    function Struct(data) {
      if (this instanceof Struct) {
        throw new Error('The `Struct` creation function should not be used with the `new` keyword.')
      }

      return schema.assert(data)
    }

    Struct[IS_STRUCT] = true
    Struct.kind = kind

    STRUCT_PROPERTIES.forEach((prop) => {
      Struct[prop] = schema[prop]
    })

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
    if (isStruct(definition)) return definition
    const kind = getKind(definition)
    const Struct = createStruct(kind, definition, defaults, options)
    return Struct
  }

  // Mix in a factory for each kind of struct.
  Object.keys(Schemas).forEach((kind) => {
    const lower = kind.toLowerCase()
    struct[lower] = (...args) => createStruct(kind, ...args)
  })

  // Mix in the `required` convenience flag.
  Object.defineProperty(struct, 'required', {
    get: () => (s, d, o = {}) => struct(s, d, { ...o, required: true })
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
  switch (kindOf(definition)) {
    case 'function': return 'Function'
    case 'string': return 'Scalar'
    case 'array': return 'List'
    case 'object': return 'Object'
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
