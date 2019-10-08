import invariant from 'tiny-invariant'
import { Branch, Failure, Path } from '../struct-error'
import { createShorthand } from './'
import { createStruct, Struct, StructOptions } from '../struct'

export const createArray = (
  schema: [any],
  defaults: any,
  options: StructOptions
): Struct => {
  invariant(
    Array.isArray(schema) && schema.length === 1,
    `Array structs must be defined as an array with one element, but you passed: ${schema}`
  )

  const Element = createShorthand(schema[0], undefined, options)
  const Struct = createStruct({
    kind: 'array',
    type: `${Element.type}[]`,
    defaults,
    options,
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
