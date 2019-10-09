import invariant from 'tiny-invariant'
import { Branch, Failure, Path, Struct, Superstruct } from '..'
import { createStruct } from '../struct'

export const createDynamic = (
  schema: (value: any, branch: Branch, path: Path) => Struct,
  defaults: any,
  struct: Superstruct
): Struct => {
  invariant(
    typeof schema === 'function',
    `Dynamic structs must be defined as a function, but you passed: ${schema}`
  )

  const Dynamic = createStruct({
    kind: 'dynamic',
    type: `dynamic<…>`,
    defaults,
    struct,
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
