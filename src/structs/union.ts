import { createStruct } from '../struct'
import { createShorthand } from './shorthand'
import { Branch, Failure, Path, Struct, StructOptions } from '../interfaces'

/**
 * TODO.
 */

export const createUnion = (
  schema: any[],
  defaults: any,
  options: StructOptions
): Struct => {
  if (!Array.isArray(schema) || schema.length < 1) {
    throw new Error(
      `Union structs must be defined as a non-empty array, but you passed: ${schema}`
    )
  }

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
    const failures: Failure[] = []

    for (const struct of Structs) {
      const [fs, v] = struct.check(value, branch, path)

      if (!fs) {
        return [undefined, v]
      } else {
        failures.push(Struct.fail({ value, branch, path }))
      }
    }

    return failures.length ? [failures] : [undefined, value]
  }

  return Struct
}
