import { assert, refine, string } from '../..'
import { test } from '..'

test<string>((x) => {
  assert(
    x,
    refine('word', string(), () => true)
  )
  return x
})
