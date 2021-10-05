import { assert, intersection, object, string } from '../..'
import { test } from '..'

test<{ a: string; b: string }>((x) => {
  assert(x, intersection([object({ a: string() }), object({ b: string() })]))
  return x
})

// Maximum call stack of 39 items
test<{
  a1: string
  a2: string
  a3: string
  a4: string
  a5: string
  a6: string
  a7: string
  a8: string
  a9: string
  a10: string
  a11: string
  a12: string
  a13: string
  a14: string
  a15: string
  a16: string
  a17: string
  a18: string
  a19: string
  a20: string
  a21: string
  a22: string
  a23: string
  a24: string
  a25: string
  a26: string
  a27: string
  a28: string
  a29: string
  a30: string
  a31: string
  a32: string
  a33: string
  a34: string
  a35: string
  a36: string
  a37: string
  a38: string
  a39: string
}>((x) => {
  assert(
    x,
    intersection([
      object({ a1: string() }),
      object({ a2: string() }),
      object({ a3: string() }),
      object({ a4: string() }),
      object({ a5: string() }),
      object({ a6: string() }),
      object({ a7: string() }),
      object({ a8: string() }),
      object({ a9: string() }),
      object({ a10: string() }),
      object({ a11: string() }),
      object({ a12: string() }),
      object({ a13: string() }),
      object({ a14: string() }),
      object({ a15: string() }),
      object({ a16: string() }),
      object({ a17: string() }),
      object({ a18: string() }),
      object({ a19: string() }),
      object({ a20: string() }),
      object({ a21: string() }),
      object({ a22: string() }),
      object({ a23: string() }),
      object({ a24: string() }),
      object({ a25: string() }),
      object({ a26: string() }),
      object({ a27: string() }),
      object({ a28: string() }),
      object({ a29: string() }),
      object({ a30: string() }),
      object({ a31: string() }),
      object({ a32: string() }),
      object({ a33: string() }),
      object({ a34: string() }),
      object({ a35: string() }),
      object({ a36: string() }),
      object({ a37: string() }),
      object({ a38: string() }),
      object({ a39: string() }),
    ])
  )
  return x
})
