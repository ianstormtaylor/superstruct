import { assert, refine, string } from '../../src'
import { test } from '..'

test<string>((x) => {
  assert(
    x,
    refine(string(), 'word', () => true)
  )
  return x
})
