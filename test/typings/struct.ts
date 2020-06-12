import { assert, struct } from '../..'
import { test } from '..'

test<string>((x) => {
  assert(
    x,
    struct<string>('custom', () => true)
  )
  return x
})
