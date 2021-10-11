import { assert, nonempty, string, array, map, set } from '../../lib'
import { test } from '..'

test<string>((x) => {
  assert(x, nonempty(string()))
  return x
})

test<Array<unknown>>((x) => {
  assert(x, nonempty(array()))
  return x
})

test<Set<unknown>>((x) => {
  assert(x, nonempty(set()))
  return x
})

test<Map<unknown, unknown>>((x) => {
  assert(x, nonempty(map()))
  return x
})
