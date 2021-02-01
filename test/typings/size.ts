import { assert, size, string, array, number, map, set } from '../..'
import { test } from '..'

test<number>((x) => {
  assert(x, size(number(), 1, 5))
  return x
})

test<string>((x) => {
  assert(x, size(string(), 1, 5))
  return x
})

test<Array<unknown>>((x) => {
  assert(x, size(array(), 1, 5))
  return x
})

test<Set<unknown>>((x) => {
  assert(x, size(set(), 1, 5))
  return x
})

test<Map<unknown, unknown>>((x) => {
  assert(x, size(map(), 1, 5))
  return x
})
