import { assert, define } from '../../src'
import { test } from '../index.test'

test<string>((x) => {
  assert(
    x,
    define<string>('custom', () => true)
  )
  return x
})
