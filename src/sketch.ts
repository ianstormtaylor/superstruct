import {
  string,
  number,
  object,
  optional,
  array,
  partial,
  date,
  defaulted,
  union,
  intersection,
  tuple,
  type,
  refinement,
} from './structs'
import { struct, assert, is } from './struct'

{
  const x: unknown = null
  const Url = struct<string>('Url', value => {
    return typeof value === 'string' && value.startsWith('http')
  })

  assert(x, Url)
  x
}

{
  const x: unknown = null
  const Email = refinement(string(), 'Email', value => value.includes('@'))
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
  const Optional = defaulted(object({ name: string() }), { name: '' })
  assert(x, Optional)
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
