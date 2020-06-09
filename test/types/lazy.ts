import { assert, lazy, string } from '../..'
import { test } from '..'

test<string>((x) => {
  assert(
    x,
    lazy(() => string())
  )
  return x
})
