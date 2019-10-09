import invariant from 'tiny-invariant'
import { Branch, Failure, Path, Struct, Superstruct } from '..'
import { createStruct } from '../struct'

export const createTuple = (
  schema: any[],
  defaults: any,
  struct: Superstruct
): Struct => {
  invariant(
    Array.isArray(schema),
    `Tuple structs must be defined as an array, but you passed: ${schema}`
  )

  const Elements = schema.map(s => struct(s))
  const Struct = createStruct({
    kind: 'tuple',
    type: `[${Elements.map(S => S.type).join()}]`,
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
