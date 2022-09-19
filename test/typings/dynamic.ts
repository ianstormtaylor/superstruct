import { assert, dynamic, string } from '../../src'
import { test } from '..'

test<string>((x) => {
  assert(
    x,
    dynamic(() => string())
  )
  return x
})
