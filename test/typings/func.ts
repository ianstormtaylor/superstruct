import { assert, func } from '../../src'
import { test } from '..'

test<Function>((x) => {
  assert(x, func())
  return x
})
