import invariant from 'tiny-invariant'
import { createStruct, Struct, StructOptions } from '../struct'
import { createShorthand } from './'
import { Branch, Failure, Path } from '../struct-error'

export const createInterface = (
  schema: any,
  defaults: any,
  options: StructOptions
): Struct => {
  invariant(
    typeof schema === 'object',
    `Interface structs must be defined as an object, but you passed: ${schema}`
  )

  const Props: Record<string, Struct> = {}

  for (const key in schema) {
    Props[key] = createShorthand(schema[key], undefined, options)
  }

  const Struct = createStruct({
    kind: 'interface',
    type: `interface<{${Object.keys(schema).join()}}>`,
    defaults,
    options,
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
