import { assert, defaulted, string } from '../../src'
import { test } from '../index.test'

test<string>((x) => {
  assert(x, defaulted(string(), 'Untitled'))
  return x
})
