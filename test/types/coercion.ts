import { assert, coercion, string } from '../../lib'
import { test } from '..'

test<string>((x) => {
  assert(
    x,
    coercion(string(), (x) => x)
  )
  return x
})
