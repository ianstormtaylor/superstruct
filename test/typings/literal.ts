import { assert, literal } from '../..'
import { test } from '..'

test<true>((x) => {
  assert(x, literal(true))
  return x
})

test<'a'>((x) => {
  assert(x, literal('a'))
  return x
})

test<42>((x) => {
  assert(x, literal(42))
  return x
})

test<Date>((x) => {
  assert(x, literal(new Date()))
  return x
})
