import { assert, coerce, string, number } from '../../src'
import { test } from '../index.test'

test<number>((x) => {
  assert(
    x,
    coerce(number(), string(), (x) => parseFloat(x))
  )
  return x
})
