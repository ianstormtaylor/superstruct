import invariant from 'tiny-invariant'
import { createStruct, Struct, StructOptions } from '../struct'
import { createShorthand } from './'
import { Branch, Failure, Path } from '../struct-error'

export const createTuple = (
  schema: any[],
  defaults: any,
  options: StructOptions
): Struct => {
  invariant(
    Array.isArray(schema),
    `Tuple structs must be defined as an array, but you passed: ${schema}`
  )

  const Elements = schema.map(s => createShorthand(s, undefined, options))
  const Struct = createStruct({
    kind: 'tuple',
    type: `[${Elements.map(S => S.type).join()}]`,
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
    const length = Math.max(value.length, Elements.length)

    for (let i = 0; i < length; i++) {
      const Element = Elements[i]
      const v = value[i]
      const p = path.concat(i)
      const b = branch.concat(v)

      if (!Element) {
        failures.push(
          Struct.fail({ type: undefined, value: v, path: p, branch: b })
        )
      } else {
        const [efs, er] = Element.check(v, b, p)

        if (efs) {
          failures.push(...efs)
        } else {
          result[i] = er
        }
      }
    }

    return failures.length ? [failures] : [undefined, result]
  }

  return Struct
}
