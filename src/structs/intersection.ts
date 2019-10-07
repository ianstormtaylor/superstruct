import invariant from 'tiny-invariant'
import { createStruct } from '../struct'
import { createShorthand } from './shorthand'
import { Branch, Failure, Path, Struct, StructOptions } from '../interfaces'

/**
 * TODO.
 */

export const createIntersection = (
  schema: any[],
  defaults: any,
  options: StructOptions
): Struct => {
  invariant(
    Array.isArray(schema) && schema.length !== 0,
    `Intersection structs must be defined as a non-empty array, but you passed: ${schema}`
  )

  const Structs = schema.map(sch => createShorthand(sch, undefined, options))
  const type = Structs.map(s => s.type).join(' & ')
  const Struct = createStruct({
    kind: 'intersection',
    type,
    defaults,
    options,
  })

  Struct.check = (
    value: any = Struct.default(),
    branch: Branch,
    path: Path
  ): [Failure[]?, any?] => {
    let result: any
    let matched = false

    for (const struct of Structs) {
      const [fs, v] = struct.check(value, branch, path)

      if (fs) {
        return [[Struct.fail({ value, branch, path })]]
      } else if (!matched) {
        result = v
        matched = true
      }
    }

    return matched
      ? [undefined, result]
      : [[Struct.fail({ value, branch, path })]]
  }

  return Struct
}
