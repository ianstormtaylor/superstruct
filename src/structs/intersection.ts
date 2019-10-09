import invariant from 'tiny-invariant'
import { Branch, Failure, Path, Struct, Superstruct } from '..'
import { createStruct } from '../struct'

export const createIntersection = (
  schema: any[],
  defaults: any,
  struct: Superstruct
): Struct => {
  invariant(
    Array.isArray(schema) && schema.length !== 0,
    `Intersection structs must be defined as a non-empty array, but you passed: ${schema}`
  )

  const Structs = schema.map(sch => struct(sch))
  const type = Structs.map(s => s.type).join(' & ')
  const Struct = createStruct({
    kind: 'intersection',
    type,
    defaults,
    struct,
  })

  Struct.check = (
    value: any = Struct.default(),
    branch: Branch,
    path: Path
  ): [Failure[]?, any?] => {
    let result: any = value

    for (const struct of Structs) {
      const [fs, v] = struct.check(value, branch, path)

      if (fs) {
        return [[Struct.fail({ value, branch, path })]]
      } else {
        result = v
      }
    }

    return [undefined, result]
  }

  return Struct
}
