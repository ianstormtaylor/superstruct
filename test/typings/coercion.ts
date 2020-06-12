import { assert, coercion, string } from '../..'
import { test } from '..'

test<string>((x) => {
  assert(
    x,
    coercion(string(), (x) => x)
  )
  return x
})
