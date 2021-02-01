import { assert, define } from '../..'
import { test } from '..'

test<string>((x) => {
  assert(
    x,
    define<string>('custom', () => true)
  )
  return x
})
