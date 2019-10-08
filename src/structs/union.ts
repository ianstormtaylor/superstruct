import invariant from 'tiny-invariant'
import { createStruct, Struct, StructOptions } from '../struct'
import { createShorthand } from './'
import { Branch, Failure, Path } from '../struct-error'

export const createUnion = (
  schema: any[],
  defaults: any,
  options: StructOptions
): Struct => {
  invariant(
    Array.isArray(schema) && schema.length !== 0,
    `Union structs must be defined as a non-empty array, but you passed: ${schema}`
  )

  const Structs = schema.map(sch => createShorthand(sch, undefined, options))
  const type = Structs.map(s => s.type).join(' | ')
  const Struct = createStruct({
    kind: 'union',
    type,
    defaults,
    options,
  })

  Struct.check = (
    value: any = Struct.default(),
    branch: Branch,
    path: Path
  ): [Failure[]?, any?] => {
    for (const struct of Structs) {
      const [fs, v] = struct.check(value, branch, path)

      if (!fs) {
        return [undefined, v]
      }
    }

    return [[Struct.fail({ value, branch, path })]]
  }

  return Struct
}
