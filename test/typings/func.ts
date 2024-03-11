import { assert, func } from '../../src'
import { test } from '../index.test'

test<Function>((x) => {
  assert(x, func())
  return x
})
