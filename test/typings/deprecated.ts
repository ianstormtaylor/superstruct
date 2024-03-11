import { assert, object, deprecated, any, Context } from '../../src'
import { test } from '../index.test'

test<unknown>((x) => {
  const log = (value: unknown, ctx: Context) => {}
  assert(x, deprecated(any(), log))
  return x
})

test<{ a?: unknown }>((x) => {
  const log = (value: unknown, ctx: Context) => {}
  assert(x, object({ a: deprecated(any(), log) }))
  return x
})
