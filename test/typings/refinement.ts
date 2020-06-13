import { assert, refinement, string } from '../..'
import { test } from '..'

test<string>((x) => {
  assert(
    x,
    refinement('word', string(), () => true)
  )
  return x
})
