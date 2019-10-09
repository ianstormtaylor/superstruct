import invariant from 'tiny-invariant'
import { Failure, Struct, Superstruct } from '..'
import { createStruct } from '../struct'

export const createLazy = (
  schema: () => Struct,
  defaults: any,
  struct: Superstruct
): Struct => {
  invariant(
    typeof schema === 'function',
    `Lazy structs must be defined as a function, but you passed: ${schema}`
  )

  const Lazy = createStruct({
    kind: 'lazy',
    type: `lazy<…>`,
    defaults,
    struct,
  })

  Lazy.check = (...args): [Failure[]?, any?] => {
    Object.assign(Lazy, schema())
    return Lazy.check(...args)
  }

  return Lazy
}
