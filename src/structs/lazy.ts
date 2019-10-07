import { createStruct } from '../struct'
import { Failure, Struct, StructOptions } from '../interfaces'

/**
 * Lazy structs allow you to initialize a struct lazily, only initializing it
 * once on the first time it attempts to be validated. They are helpful for
 * defining recursive structs.
 */

export const createLazy = (
  schema: () => Struct,
  defaults: any,
  options: StructOptions
): Struct => {
  if (typeof schema !== 'function') {
    throw new Error(
      `Lazy structs must be defined as a function, but you passed: ${schema}`
    )
  }

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
