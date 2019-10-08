import invariant from 'tiny-invariant'
import { createStruct, Struct, StructOptions } from '../struct'
import { Failure } from '../struct-error'

export const createLazy = (
  schema: () => Struct,
  defaults: any,
  options: StructOptions
): Struct => {
  invariant(
    typeof schema === 'function',
    `Lazy structs must be defined as a function, but you passed: ${schema}`
  )

  const Lazy = createStruct({
    kind: 'lazy',
    type: `lazy<…>`,
    defaults,
    options,
  })

  Lazy.check = (...args): [Failure[]?, any?] => {
    Object.assign(Lazy, schema())
    return Lazy.check(...args)
  }

  return Lazy
}
