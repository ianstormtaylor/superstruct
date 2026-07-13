import { assign, boolean, defaulted, object, string } from '../../../src'

// Regression test for https://github.com/ianstormtaylor/superstruct/issues/791
// `assign` must preserve the coercion (e.g. `defaulted`) of the structs it
// merges instead of silently dropping it.

export const Struct = assign(
  defaulted(
    object({
      id: string(),
      enabled: boolean(),
    }),
    { enabled: false }
  ),
  object({
    name: string(),
  })
)

export const data = {
  id: 'a',
  name: 'b',
}

export const output = {
  id: 'a',
  name: 'b',
  enabled: false,
}

export const create = true
