import { assert, coerce, string, number } from '../../src'
import { test } from '..'

test<number>((x) => {
  assert(
    x,
    coerce(number(), string(), (x) => parseFloat(x))
  )
  return x
})
