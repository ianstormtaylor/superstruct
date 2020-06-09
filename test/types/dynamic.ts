import { assert, dynamic, string } from '../..'
import { test } from '..'

test<string>((x) => {
  assert(
    x,
    dynamic(() => string())
  )
  return x
})
