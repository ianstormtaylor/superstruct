import { assert, define } from '../../src'
import { test } from '..'

test<string>((x) => {
  assert(
    x,
    define<string>('custom', () => true)
  )
  return x
})
