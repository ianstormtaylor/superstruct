import { assert, notEmpty, string, array, map, set } from '../..'
import { test } from '..'

test<string>((x) => {
  assert(x, notEmpty(string()))
  return x
})

test<Array<unknown>>((x) => {
  assert(x, notEmpty(array()))
  return x
})

test<Set<unknown>>((x) => {
  assert(x, notEmpty(set()))
  return x
})

test<Map<unknown, unknown>>((x) => {
  assert(x, notEmpty(map()))
  return x
})
