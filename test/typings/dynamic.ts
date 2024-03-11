import { assert, dynamic, string } from '../../src'
import { test } from '../index.test'

test<string>((x) => {
  assert(
    x,
    dynamic(() => string())
  )
  return x
})
