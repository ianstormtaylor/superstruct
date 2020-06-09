import { assert, defaulted, string } from '../..'
import { test } from '..'

test<string>((x) => {
  assert(x, defaulted(string(), 'Untitled'))
  return x
})
