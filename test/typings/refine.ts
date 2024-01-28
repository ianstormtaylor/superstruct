import { assert, refine, string } from '../../src'
import { test } from '../index.test'

test<string>((x) => {
  assert(
    x,
    refine(string(), 'word', () => true)
  )
  return x
})
