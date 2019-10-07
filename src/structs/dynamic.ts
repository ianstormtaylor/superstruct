import invariant from 'tiny-invariant'
import { createStruct } from '../struct'
import { Branch, Failure, Path, Struct, StructOptions } from '../interfaces'

/**
 * Dynamic structs allow you to initialize a struct lazily, only initializing it
 * once on the first time it attempts to be validated. They are helpful for
 * defining recursive structs.
 */

export const createDynamic = (
  schema: (value: any, branch: Branch, path: Path) => Struct,
  defaults: any,
  options: StructOptions
): Struct => {
  invariant(
    typeof schema === 'function',
    `Dynamic structs must be defined as a function, but you passed: ${schema}`
  )

  const Dynamic = createStruct({
    kind: 'dynamic',
    type: `dynamic<…>`,
    defaults,
    options,
  })

  Dynamic.check = (
    value: any = Dynamic.default(),
    branch: Branch,
    path: Path
  ): [Failure[]?, any?] => {
    const Struct = schema(value, branch, path)
    return Struct.check(value, branch, path)
  }

  return Dynamic
}
