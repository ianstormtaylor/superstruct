import { assert, refine, string } from '../..'
import { test } from '..'

test<string>((x) => {
  assert(
    x,
    refine(string(), 'word', () => true)
  )
  return x
})
