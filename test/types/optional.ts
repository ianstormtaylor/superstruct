import { assert, optional, string, number, object } from '../..'
import { test } from '..'

test<string | undefined>((x) => {
  assert(x, optional(string()))
  return x
})

test<{
  a?: number | undefined
  b: string
}>((x) => {
  assert(
    x,
    object({
      a: optional(number()),
      b: string(),
    })
  )
  return x
})
