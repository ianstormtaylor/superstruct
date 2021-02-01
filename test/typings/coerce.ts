import { assert, coerce, string, number } from '../..'
import { test } from '..'

test<number>((x) => {
  assert(
    x,
    coerce(number(), string(), (x) => parseFloat(x))
  )
  return x
})
