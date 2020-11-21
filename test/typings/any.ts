import { assert, any } from '../..'
import { test } from '..'

test<any>((x) => {
  assert(x, any())
  return x
})
