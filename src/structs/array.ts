import invariant from 'tiny-invariant'
import { Branch, Failure, Path, Struct, Superstruct } from '..'
import { createStruct } from '../struct'

export const createArray = (
  schema: [any],
  defaults: any,
  struct: Superstruct
): Struct => {
  invariant(
    Array.isArray(schema) && schema.length === 1,
    `Array structs must be defined as an array with one element, but you passed: ${schema}`
  )

  const Element = struct(schema[0], undefined)
  const Struct = createStruct({
    kind: 'array',
    type: `${Element.type}[]`,
    defaults,
    struct,
  })

  Struct.check = (
    value: any = Struct.default(),
    branch: Branch,
    path: Path
  ): [Failure[]?, any?] => {
    if (!Array.isArray(value)) {
      return [[Struct.fail({ value, branch, path })]]
    }

    const result = []
    const failures: Failure[] = []

    for (let i = 0; i < value.length; i++) {
      const v = value[i]
      const [efs, er] = Element.check(v, branch.concat(v), path.concat(i))

      if (efs) {
        failures.push(...efs)
        continue
      }

      result[i] = er
    }

    return failures.length ? [failures] : [undefined, result]
  }

  return Struct
}
