import { assert, lazy, string } from '../../src'
import { test } from '..'

test<string>((x) => {
  assert(
    x,
    lazy(() => string())
  )
  return x
})
