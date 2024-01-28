import { assert, lazy, string } from '../../src'
import { test } from '../index.test'

test<string>((x) => {
  assert(
    x,
    lazy(() => string())
  )
  return x
})
