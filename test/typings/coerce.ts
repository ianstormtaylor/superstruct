import { assert, coerce, string } from '../..'
import { test } from '..'

test<string>((x) => {
  assert(
    x,
    coerce(string(), (x) => x)
  )
  return x
})
