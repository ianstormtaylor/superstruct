import { assert, refinement, string } from '../..'
import { test } from '..'

test<string>((x) => {
  assert(
    x,
    refinement(string(), 'word', () => true)
  )
  return x
})
