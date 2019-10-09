import invariant from 'tiny-invariant'
import { Branch, Failure, Path, Struct, Superstruct } from '..'
import { createStruct } from '../struct'

export const createInterface = (
  schema: any,
  defaults: any,
  struct: Superstruct
): Struct => {
  invariant(
    typeof schema === 'object',
    `Interface structs must be defined as an object, but you passed: ${schema}`
  )

  const Props: Record<string, Struct> = {}

  for (const key in schema) {
    Props[key] = struct(schema[key])
  }

  const Struct = createStruct({
    kind: 'interface',
    type: `interface<{${Object.keys(schema).join()}}>`,
    defaults,
    struct,
  })

  Struct.check = (
    value: any = Struct.default(),
    branch: Branch,
    path: Path
  ): [Failure[]?, any?] => {
    if (typeof value !== 'object' && typeof value !== 'function') {
      return [[Struct.fail({ value, branch, path })]]
    }

    const failures: Failure[] = []

    for (const k in Props) {
      const Prop = Props[k]
      const v = value[k]
      const [pfs] = Prop.check(v, branch.concat(v), path.concat(k))

      if (pfs) {
        failures.push(...pfs)
      }
    }

    return failures.length ? [failures] : [undefined, value]
  }

  return Struct
}
