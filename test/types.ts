/* eslint-disable */
import {
  array,
  assert,
  date,
  defaulted,
  intersection,
  is,
  literal,
  number,
  object,
  optional,
  partial,
  refinement,
  string,
  struct,
  StructType,
  tuple,
  type,
  union,
  enums,
} from '..'

{
  const String = string()
  type T = StructType<typeof String>
}

{
  const x: unknown = null
  const Url = struct<string>('Url', (value) => {
    return typeof value === 'string' && value.startsWith('http')
  })

  assert(x, Url)
  x
}

{
  const x: unknown = null
  const Email = refinement(string(), 'Email', (value) => value.includes('@'))
  assert(x, Email)
  x
}

{
  const x: unknown = null
  const String = string()
  assert(x, String)
  x
}

{
  const x: unknown = null
  const Number = number()
  assert(x, Number)
  x
}

{
  const x: unknown = null
  const Literal = literal('hello')
  assert(x, Literal)
  x
}

{
  const x: unknown = null
  const User = object({ name: string() })

  if (is(x, User)) {
    x
  }
}

{
  const x: unknown = null
  const Path = array(number())

  if (is(x, Path)) {
    x
  }
}

{
  const x: unknown = null
  const Article = partial({ name: string() })
  assert(x, Article)
  x
}

{
  const x: unknown = null
  const Or = union([string(), number()])
  assert(x, Or)
  x
}

{
  const x: unknown = null
  const And = intersection([string(), number()])
  assert(x, And)
  x
}

{
  const x: unknown = null
  const Tuple = tuple([string(), number()])
  assert(x, Tuple)
  x
}

{
  const x: unknown = null
  const Struct = type({ a: string() })
  assert(x, Struct)
  x
}

{
  const x: unknown = null
  const Defaults = defaulted(object({ name: string() }), { name: '' })
  assert(x, Defaults)
  x
}

{
  const x: unknown = null
  const Article = object({
    title: defaulted(string(), 'Untitled'),
    content: string(),
    published_at: optional(date()),
  })

  assert(x, Article)
  x
}

{
  const x: unknown = null
  const Enums = enums(['a', 'b', 'c'])
  assert(x, Enums)
  x
}
