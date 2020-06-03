import {
  string,
  number,
  object,
  optional,
  array,
  partial,
  date,
  union,
  intersection,
  tuple,
  type,
} from './structs'
import { Struct, assert, is, constrain } from './struct'

const input = 0 as unknown

{
  const Url = new Struct<string>({
    type: 'Url',
    validate: (value, fail) => {
      return typeof value === 'string' && value.startsWith('http')
        ? []
        : [fail()]
    },
  })

  const value = assert(input, Url, true)
}

{
  const Email = constrain(string(), (value, fail) => {
    return value.includes('@') ? [] : [fail()]
  })

  const value = assert(input, Email, true)
}

{
  const String = string()
  const value = assert(input, String, true)
}

{
  const Number = number()
  assert(input, Number)
  input
}

{
  const User = object({ name: string() })

  if (is(input, User)) {
    input
  }
}

{
  const Path = array(number())

  if (is(input, Path, true)) {
    input
  }
}

{
  const Article = partial({ name: string() })
  const value = assert(input, Article, true)
}

{
  const Or = union([string(), number()])
  const value = assert(input, Or, true)
}

{
  const And = intersection([string(), number()])
  const value = assert(input, And, true)
}

{
  const Tuple = tuple([string(), number()])
  const value = assert(input, Tuple, true)
}

{
  const Struct = type({ a: string() })
  const value = assert(input, Struct, true)
}

{
  const Optional = optional(object({ name: string() }), { name: '' })
  const value = assert(input, Optional, true)
}

{
  const Article = object({
    title: optional(string(), 'Untitled'),
    content: string(),
    published_at: optional(date(), () => new Date()),
  })

  const value = assert(input, Article, true)
}
