import kindOf from 'kind-of'

import { KIND } from './constants'
import { isStruct, resolveDefaults } from './utils'

/**
 * Kind.
 *
 * @type {Kind}
 */

class Kind {
  constructor(name, type, validate) {
    this.name = name
    this.type = type
    this.validate = validate
  }
}

/**
 * Any.
 *
 * @param {Array|Function|Object|String} schema
 * @param {Any} defaults
 * @param {Object} options
 */

function any(schema, defaults, options) {
  if (isStruct(schema)) {
    return schema[KIND]
  }

  if (schema instanceof Kind) {
    return schema
  }

  switch (kindOf(schema)) {
    case 'array': {
      return schema.length > 1
        ? tuple(schema, defaults, options)
        : list(schema, defaults, options)
    }

    case 'function': {
      return func(schema, defaults, options)
    }

    case 'object': {
      return object(schema, defaults, options)
    }

    case 'string': {
      let required = true
      let type

      if (schema.endsWith('?')) {
        required = false
        schema = schema.slice(0, -1)
      }

      if (schema.includes('|')) {
        const scalars = schema.split(/\s*\|\s*/g)
        type = union(scalars, defaults, options)
      } else if (schema.includes('&')) {
        const scalars = schema.split(/\s*&\s*/g)
        type = intersection(scalars, defaults, options)
      } else {
        type = scalar(schema, defaults, options)
      }

      if (!required) {
        type = optional(type, undefined, options)
      }

      return type
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    throw new Error(
      `A schema definition must be an object, array, string or function, but you passed: ${schema}`
    )
  } else {
    throw new Error(`Invalid schema: ${schema}`)
  }
}

/**
 * Dict.
 *
 * @param {Array} schema
 * @param {Object} defaults
 * @param {Object} options
 */

function dict(schema, defaults, options) {
  if (kindOf(schema) !== 'array' || schema.length !== 2) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(
        `Dict structs must be defined as an array with two elements, but you passed: ${schema}`
      )
    } else {
      throw new Error(`Invalid schema: ${schema}`)
    }
  }

  const obj = scalar('object', undefined, options)
  const keys = any(schema[0], undefined, options)
  const values = any(schema[1], undefined, options)
  const name = 'dict'
  const type = `dict<${keys.type},${values.type}>`
  const validate = value => {
    const resolved = resolveDefaults(defaults)
    value = resolved ? { ...resolved, ...value } : value
    const [error] = obj.validate(value)

    if (error) {
      error.type = type
      return [error]
    }

    const ret = {}
    const errors = []

    for (let k in value) {
      const v = value[k]
      const [e, r] = keys.validate(k)

      if (e) {
        const allE = e.errors || [e]
        allE.forEach(singleE => {
          singleE.path = [k].concat(singleE.path)
          singleE.data = value
          errors.push(singleE)
        })
        continue
      }

      k = r
      const [e2, r2] = values.validate(v)

      if (e2) {
        const allE2 = e2.errors || [e2]
        allE2.forEach(singleE => {
          singleE.path = [k].concat(singleE.path)
          singleE.data = value
          errors.push(singleE)
        })
        continue
      }

      ret[k] = r2
    }

    if (errors.length) {
      const first = errors[0]
      first.errors = errors
      return [first]
    }

    return [undefined, ret]
  }

  return new Kind(name, type, validate)
}

/**
 * Enum.
 *
 * @param {Array} schema
 * @param {Any} defaults
 * @param {Object} options
 */

function en(schema, defaults, options) {
  if (kindOf(schema) !== 'array') {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(
        `Enum structs must be defined as an array, but you passed: ${schema}`
      )
    } else {
      throw new Error(`Invalid schema: ${schema}`)
    }
  }

  const name = 'enum'
  const type = schema
    .map(s => {
      try {
        return JSON.stringify(s)
      } catch (e) {
        return String(s)
      }
    })
    .join(' | ')

  const validate = (value = resolveDefaults(defaults)) => {
    return schema.includes(value)
      ? [undefined, value]
      : [{ data: value, path: [], value, type }]
  }

  return new Kind(name, type, validate)
}

/**
 * Enums.
 *
 * @param {Array} schema
 * @param {Any} defaults
 * @param {Object} options
 */

function enums(schema, defaults, options) {
  const e = en(schema, undefined, options)
  const l = list([e], defaults, options)
  return l
}

/**
 * Function.
 *
 * @param {Function} schema
 * @param {Any} defaults
 * @param {Object} options
 */

function func(schema, defaults, options) {
  if (kindOf(schema) !== 'function') {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(
        `Function structs must be defined as a function, but you passed: ${schema}`
      )
    } else {
      throw new Error(`Invalid schema: ${schema}`)
    }
  }

  const name = 'function'
  const type = '<function>'
  const validate = (value = resolveDefaults(defaults), data) => {
    const result = schema(value, data)
    let failure = { path: [], reason: null }
    let isValid

    switch (kindOf(result)) {
      case 'boolean': {
        isValid = result
        break
      }
      case 'string': {
        isValid = false
        failure.reason = result
        break
      }
      case 'object': {
        isValid = false
        failure = { ...failure, ...result }
        break
      }
      default: {
        if (process.env.NODE_ENV !== 'production') {
          throw new Error(
            `Validator functions must return a boolean, an error reason string or an error reason object, but you passed: ${schema}`
          )
        } else {
          throw new Error(`Invalid result: ${result}`)
        }
      }
    }

    return isValid
      ? [undefined, value]
      : [{ type, value, data: value, ...failure }]
  }

  return new Kind(name, type, validate)
}

/**
 * Instance.
 *
 * @param {Array} schema
 * @param {Any} defaults
 * @param {Object} options
 */

function instance(schema, defaults, options) {
  const name = 'instance'
  const type = `instance<${schema.name}>`
  const validate = (value = resolveDefaults(defaults)) => {
    return value instanceof schema
      ? [undefined, value]
      : [{ data: value, path: [], value, type }]
  }

  return new Kind(name, type, validate)
}

/**
 * Interface.
 *
 * @param {Object} schema
 * @param {Object} defaults
 * @param {Object} options
 */

function inter(schema, defaults, options) {
  if (kindOf(schema) !== 'object') {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(
        `Interface structs must be defined as an object, but you passed: ${schema}`
      )
    } else {
      throw new Error(`Invalid schema: ${schema}`)
    }
  }

  const ks = []
  const properties = {}

  for (const key in schema) {
    ks.push(key)
    const s = schema[key]
    const kind = any(s, undefined, options)
    properties[key] = kind
  }

  const name = 'interface'
  const type = `{${ks.join()}}`
  const validate = (value = resolveDefaults(defaults)) => {
    const errors = []
    const ret = value

    for (const key in properties) {
      let v = value[key]
      const kind = properties[key]

      if (v === undefined) {
        const d = defaults && defaults[key]
        v = resolveDefaults(d, value)
      }

      const [e, r] = kind.validate(v, value)

      if (e) {
        const allE = e.errors || [e]
        allE.forEach(singleE => {
          singleE.path = [key].concat(singleE.path)
          singleE.data = value
          errors.push(singleE)
        })
        continue
      }

      if (key in value || r !== undefined) {
        ret[key] = r
      }
    }

    if (errors.length) {
      const first = errors[0]
      first.errors = errors
      return [first]
    }

    return [undefined, ret]
  }

  return new Kind(name, type, validate)
}

/**
 * Lazy.
 *
 * @param {Function} schema
 * @param {Any} defaults
 * @param {Object} options
 */

function lazy(schema, defaults, options) {
  if (kindOf(schema) !== 'function') {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(
        `Lazy structs must be defined as an function that returns a schema, but you passed: ${schema}`
      )
    } else {
      throw new Error(`Invalid schema: ${schema}`)
    }
  }

  let kind
  let struct
  const name = 'lazy'
  const type = `lazy...`
  const compile = value => {
    struct = schema()
    kind.name = struct.kind
    kind.type = struct.type
    kind.validate = struct.validate
    return kind.validate(value)
  }

  kind = new Kind(name, type, compile)
  return kind
}

/**
 * Dynamic.
 *
 * @param {Function} createSchema
 * @param {Any} defaults
 * @param {Object} options
 */

function dynamic(createSchema, defaults, options) {
  if (kindOf(createSchema) !== 'function') {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(
        `Dynamic structs must be defined as a function, but you passed: ${createSchema}`
      )
    } else {
      throw new Error(`Invalid schema: ${createSchema}`)
    }
  }

  const name = 'dynamic'
  const type = 'dynamic...'
  const validate = (value = resolveDefaults(defaults), data) => {
    const schema = createSchema(value, data)

    if (kindOf(schema) !== 'function') {
      if (process.env.NODE_ENV !== 'production') {
        throw new Error(
          `Dynamic structs must return a schema, but you passed: ${schema}`
        )
      } else {
        throw new Error(`Invalid schema: ${schema}`)
      }
    }

    const [error, result] = schema.validate(value)

    if (error) {
      return [error]
    }

    return [undefined, result]
  }

  return new Kind(name, type, validate)
}

/**
 * List.
 *
 * @param {Array} schema
 * @param {Array} defaults
 * @param {Object} options
 */

function list(schema, defaults, options) {
  if (kindOf(schema) !== 'array' || schema.length !== 1) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(
        `List structs must be defined as an array with a single element, but you passed: ${schema}`
      )
    } else {
      throw new Error(`Invalid schema: ${schema}`)
    }
  }

  const array = scalar('array', undefined, options)
  const element = any(schema[0], undefined, options)
  const name = 'list'
  const type = `[${element.type}]`
  const validate = (value = resolveDefaults(defaults)) => {
    const [error, result] = array.validate(value)

    if (error) {
      error.type = type
      return [error]
    }

    value = result
    const errors = []
    const ret = []

    for (let i = 0; i < value.length; i++) {
      const v = value[i]
      const [e, r] = element.validate(v)

      if (e) {
        const allE = e.errors || [e]
        allE.forEach(singleE => {
          singleE.path = [i].concat(singleE.path)
          singleE.data = value
          errors.push(singleE)
        })
        continue
      }

      ret[i] = r
    }

    if (errors.length) {
      const first = errors[0]
      first.errors = errors
      return [first]
    }

    return [undefined, ret]
  }

  return new Kind(name, type, validate)
}

/**
 * Literal.
 *
 * @param {Array} schema
 * @param {Any} defaults
 * @param {Object} options
 */

function literal(schema, defaults, options) {
  const name = 'literal'
  const type = `literal: ${JSON.stringify(schema)}`
  const validate = (value = resolveDefaults(defaults)) => {
    return value === schema
      ? [undefined, value]
      : [{ data: value, path: [], value, type }]
  }

  return new Kind(name, type, validate)
}

/**
 * Object.
 *
 * @param {Object} schema
 * @param {Object} defaults
 * @param {Object} options
 */

function object(schema, defaults, options) {
  if (kindOf(schema) !== 'object') {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(
        `Object structs must be defined as an object, but you passed: ${schema}`
      )
    } else {
      throw new Error(`Invalid schema: ${schema}`)
    }
  }

  const obj = scalar('object', undefined, options)
  const ks = []
  const properties = {}

  for (const key in schema) {
    ks.push(key)
    const s = schema[key]
    const kind = any(s, undefined, options)
    properties[key] = kind
  }

  const name = 'object'
  const type = `{${ks.join()}}`
  const validate = (value = resolveDefaults(defaults)) => {
    const [error] = obj.validate(value)

    if (error) {
      error.type = type
      return [error]
    }

    const errors = []
    const ret = {}
    const valueKeys = Object.keys(value)
    const propertiesKeys = Object.keys(properties)
    const keys = new Set(valueKeys.concat(propertiesKeys))

    keys.forEach(key => {
      let v = value[key]
      const kind = properties[key]

      if (v === undefined) {
        const d = defaults && defaults[key]
        v = resolveDefaults(d, value)
      }

      if (!kind) {
        const e = { data: value, path: [key], value: v }
        errors.push(e)
        return
      }

      const [e, r] = kind.validate(v, value)

      if (e) {
        const allE = e.errors || [e]
        allE.forEach(singleE => {
          singleE.path = [key].concat(singleE.path)
          singleE.data = value
          errors.push(singleE)
        })
        return
      }

      if (key in value || r !== undefined) {
        ret[key] = r
      }
    })

    if (errors.length) {
      const first = errors[0]
      first.errors = errors
      return [first]
    }

    return [undefined, ret]
  }

  return new Kind(name, type, validate)
}

/**
 * Optional.
 *
 * @param {Any} schema
 * @param {Any} defaults
 * @param {Object} options
 */

function optional(schema, defaults, options) {
  return union([schema, 'undefined'], defaults, options)
}

/**
 * Partial.
 *
 * @param {Object} schema
 * @param {Object} defaults
 * @param {Object} options
 */

function partial(schema, defaults, options) {
  if (kindOf(schema) !== 'object') {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(
        `Partial structs must be defined as an object, but you passed: ${schema}`
      )
    } else {
      throw new Error(`Invalid schema: ${schema}`)
    }
  }

  const obj = scalar('object', undefined, options)
  const ks = []
  const properties = {}

  for (const key in schema) {
    ks.push(key)
    const s = schema[key]
    const kind = any(s, undefined, options)
    properties[key] = kind
  }

  const name = 'partial'
  const type = `{${ks.join()},...}`
  const validate = (value = resolveDefaults(defaults)) => {
    const [error] = obj.validate(value)

    if (error) {
      error.type = type
      return [error]
    }

    const errors = []
    const ret = {}

    for (const key in properties) {
      let v = value[key]
      const kind = properties[key]

      if (v === undefined) {
        const d = defaults && defaults[key]
        v = resolveDefaults(d, value)
      }

      const [e, r] = kind.validate(v, value)

      if (e) {
        const allE = e.errors || [e]
        allE.forEach(singleE => {
          singleE.path = [key].concat(singleE.path)
          singleE.data = value
          errors.push(singleE)
        })
        continue
      }

      if (key in value || r !== undefined) {
        ret[key] = r
      }
    }

    if (errors.length) {
      const first = errors[0]
      first.errors = errors
      return [first]
    }

    return [undefined, ret]
  }

  return new Kind(name, type, validate)
}

/**
 * Scalar.
 *
 * @param {String} schema
 * @param {Any} defaults
 * @param {Object} options
 */

function scalar(schema, defaults, options) {
  if (kindOf(schema) !== 'string') {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(
        `Scalar structs must be defined as a string, but you passed: ${schema}`
      )
    } else {
      throw new Error(`Invalid schema: ${schema}`)
    }
  }

  const { types } = options
  const fn = types[schema]

  if (kindOf(fn) !== 'function') {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(
        `No struct validator function found for type "${schema}".`
      )
    } else {
      throw new Error(`Invalid type: ${schema}`)
    }
  }

  const kind = func(fn, defaults, options)
  const name = 'scalar'
  const type = schema
  const validate = value => {
    const [error, result] = kind.validate(value)

    if (error) {
      error.type = type
      return [error]
    }

    return [undefined, result]
  }

  return new Kind(name, type, validate)
}

/**
 * Tuple.
 *
 * @param {Array} schema
 * @param {Array} defaults
 * @param {Object} options
 */

function tuple(schema, defaults, options) {
  if (kindOf(schema) !== 'array') {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(
        `Tuple structs must be defined as an array, but you passed: ${schema}`
      )
    } else {
      throw new Error(`Invalid schema: ${schema}`)
    }
  }

  const kinds = schema.map(s => any(s, undefined, options))
  const array = scalar('array', undefined, options)
  const name = 'tuple'
  const type = `[${kinds.map(k => k.type).join()}]`
  const validate = (value = resolveDefaults(defaults)) => {
    const [error] = array.validate(value)

    if (error) {
      error.type = type
      return [error]
    }

    const ret = []
    const errors = []
    const length = Math.max(value.length, kinds.length)

    for (let i = 0; i < length; i++) {
      const kind = kinds[i]
      const v = value[i]

      if (!kind) {
        const e = { data: value, path: [i], value: v }
        errors.push(e)
        continue
      }

      const [e, r] = kind.validate(v)

      if (e) {
        const allE = e.errors || [e]
        allE.forEach(singleE => {
          singleE.path = [i].concat(singleE.path)
          singleE.data = value
          errors.push(singleE)
        })
        continue
      }

      ret[i] = r
    }

    if (errors.length) {
      const first = errors[0]
      first.errors = errors
      return [first]
    }

    return [undefined, ret]
  }

  return new Kind(name, type, validate)
}

/**
 * Union.
 *
 * @param {Array} schema
 * @param {Any} defaults
 * @param {Object} options
 */

function union(schema, defaults, options) {
  if (kindOf(schema) !== 'array') {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(
        `Union structs must be defined as an array, but you passed: ${schema}`
      )
    } else {
      throw new Error(`Invalid schema: ${schema}`)
    }
  }

  const kinds = schema.map(s => any(s, undefined, options))
  const name = 'union'
  const type = kinds.map(k => k.type).join(' | ')
  const validate = (value = resolveDefaults(defaults)) => {
    const errors = []

    for (const k of kinds) {
      const [e, r] = k.validate(value)

      if (!e) {
        return [undefined, r]
      }

      errors.push(e)
    }
    errors[0].type = type
    return errors
  }

  return new Kind(name, type, validate)
}

/**
 * Intersection.
 *
 * @param {Array} schema
 * @param {Any} defaults
 * @param {Object} options
 */

function intersection(schema, defaults, options) {
  if (kindOf(schema) !== 'array') {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(
        `Intersection structs must be defined as an array, but you passed: ${schema}`
      )
    } else {
      throw new Error(`Invalid schema: ${schema}`)
    }
  }

  const types = schema.map(s => any(s, undefined, options))
  const name = 'intersection'
  const type = types.map(t => t.type).join(' & ')
  const validate = (value = resolveDefaults(defaults)) => {
    let v = value

    for (const t of types) {
      const [e, r] = t.validate(v)

      if (e) {
        e.type = type
        return [e]
      }

      v = r
    }

    return [undefined, v]
  }

  return new Kind(name, type, validate)
}

/**
 * Kinds.
 *
 * @type {Object}
 */

const Kinds = {
  any,
  dict,
  enum: en,
  enums,
  function: func,
  instance,
  interface: inter,
  lazy,
  list,
  literal,
  object,
  optional,
  partial,
  scalar,
  tuple,
  union,
  intersection,
  dynamic,
}

/**
 * Export.
 *
 * @type {Object}
 */

export default Kinds
