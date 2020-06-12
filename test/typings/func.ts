import { assert, func } from '../..'
import { test } from '..'

test<Function>((x) => {
  assert(x, func())
  return x
})
