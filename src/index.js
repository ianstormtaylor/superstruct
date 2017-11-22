
import cloneDeep from 'lodash/cloneDeep'
import err from 'custom-err'
import is from 'is'

/**
 * Default types.
 *
 * @type {Object}
 */

const DEFAULT_TYPES = {
  any: v => v !== undefined,
  array: is.array,
  boolean: is.boolean,
  date: is.date,
  function: is.function,
  null: is.null,
  number: is.number,
  object: is.object,
  string: is.string,
  undefined: is.undefined,
}

/**
 * Create a struct factory from a set of `options`.
 *
 * @param {Object} options
 * @return {Function}
 */

function createStruct(options = {}) {
  const { types = {}, error } = options

  /**
   * Define a function struct with a `schema` function.
   *
   * @param {Function} schema
   * @param {Any} defaults
   * @return {Function}
   */

  function functionStruct(schema, defaults) {
    const def = toDefinition(schema)
    const validate = schema

    if (defaults !== undefined && !validate(defaults)) {
      throw new Error(`The \`defaults\` argument for the struct "${def}" was invalid.`)
    }

    return (value) => {
      value = toValue(value, defaults)

      if (!validate(value)) {
        throw err(`The value "${value}" was invalid. It should have matched the struct "${def}".`, {
          code: 'value_invalid',
          path: [],
          value,
        })
      }

      return value
    }
  }

  /**
   * Define a scalar struct with a `schema` type string.
   *
   * @param {String} schema
   * @param {Any} defaults
   * @return {Function}
   */

  function scalarStruct(schema, defaults) {
    const def = toDefinition(schema)
    let type = schema
    const isRequired = type.endsWith('!')

    if (isRequired) {
      type = type.slice(0, -1)
    }

    let fn = types[type] || DEFAULT_TYPES[type]

    if (typeof fn !== 'function') {
      throw new Error(`No struct validator found for type: "${type}"`)
    }

    if (!isRequired) {
      const original = fn
      fn = v => v === undefined || original(v)
    }

    const validate = functionStruct(fn, defaults)

    if (defaults !== undefined) {
      try {
        validate(defaults)
      } catch (e) {
        throw new Error(`The \`defaults\` argument for the struct "${def}" was invalid.`)
      }
    }

    return (value) => {
      let ret

      try {
        ret = validate(value)
      } catch (e) {
        throw err(`The scalar "${value}" was invalid. It should have matched the struct "${def}".`, {
          code: 'scalar_invalid',
          type,
          path: [],
          value,
        })
      }

      return ret
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
      throw new Error(`List structs must be defined with an array with 1 element, but you passed: ${schema.length} elements.`)
    }

    const def = toDefinition(schema)
    schema = schema[0]
    const fn = struct(schema)

    if (defaults !== undefined) {
      try {
        defaults.forEach(d => fn(d))
      } catch (e) {
        throw new Error(`The \`defaults\` argument for the struct "${def}" was invalid.`)
      }
    }

    return (value) => {
      value = toValue(value, defaults)

      if (!is.array(value)) {
        throw err(`The list "${value}" was invalid. It should have matched the struct "${def}".`, {
          code: 'list_invalid',
          path: [],
          value,
        })
      }

      const ret = value.map((v, i) => {
        try {
          return fn(v)
        } catch (e) {
          throw err(`The element at index \`${i}\` in an array was invalid. It should have matched the struct "${def}". The element in question was: ${v}`, {
            code: 'element_invalid',
            index: i,
            path: [i].concat(e.path),
            value: v,
          })
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
    const def = toDefinition(schema)
    const structs = {}

    for (const key in schema) {
      const fn = struct(schema[key])
      structs[key] = fn

      if (defaults !== undefined && key in defaults) {
        try {
          fn(defaults[key])
        } catch (e) {
          throw new Error(`The \`defaults\` argument for the \`${key}\` key of struct "${def}" was invalid.`)
        }
      }
    }

    return (value) => {
      value = toValue(value, defaults)

      if (!is.object(value)) {
        throw err(`The object "${value}" was invalid. It should have matched the struct "${def}".`, {
          code: 'object_invalid',
          path: [],
          value,
        })
      }

      const ret = {}

      for (const key in structs) {
        const s = structs[key]
        const v = value[key]
        let r

        try {
          r = s(v)
        } catch (e) {
          throw err(`The \`${key}\` property in an object was invalid. It should have matched the struct "${def}". The property in question was: ${v}`, {
            code: 'property_invalid',
            key,
            path: [key].concat(e.path),
            value: v,
          })
        }

        if (key in value) {
          ret[key] = r
        }
      }

      for (const key in value) {
        if (!(key in structs)) {
          throw err(`The \`${key}\` property in an object was not recognized. It did not appear in the struct "${def}".`, {
            code: 'property_unknown',
            key,
            path: [key],
          })
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

    if (is.function(schema)) {
      s = functionStruct(schema, defaults)
    } else if (is.string(schema)) {
      s = scalarStruct(schema, defaults)
    } else if (is.array(schema)) {
      s = listStruct(schema, defaults)
    } else if (is.object(schema)) {
      s = objectStruct(schema, defaults)
    } else {
      throw new Error(`A struct schema definition must be a function, string, array or object, but you passed: ${schema}.`)
    }

    return (value) => {
      let ret

      try {
        ret = s(value)
      } catch (e) {
        throw error ? error(e) : e
      }

      return ret
    }
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
 * Resolve a `schema` into a string representing the schema definition.
 *
 * @param {Function|String|Array|Object} schema
 * @return {String}
 */

function toDefinition(schema) {
  if (is.string(schema)) {
    return schema
  } else if (is.function(schema)) {
    return schema.toString()
  } else {
    return JSON.stringify(schema)
  }
}

/**
 * Export the factory and the factory creator.
 *
 * @type {Function}
 */

export default createStruct()
export { createStruct }
