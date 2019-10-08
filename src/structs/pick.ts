import invariant from 'tiny-invariant'
import kindOf from 'kind-of'
import { createStruct, Struct, StructOptions } from '../struct'
import { createShorthand } from './'
import { Branch, Failure, Path } from '../struct-error'

export const createPick = (
  schema: {},
  defaults: any,
  options: StructOptions
): Struct => {
  invariant(
    typeof schema === 'object',
    `Pick structs must be defined as an object, but you passed: ${schema}`
  )

  const Props: Record<string, Struct> = {}

  for (const key in schema) {
    Props[key] = createShorthand(schema[key], undefined, options)
  }

  const Struct = createStruct({
    kind: 'pick',
    type: `pick<{${Object.keys(schema).join()}}>`,
    defaults,
    options,
  })

  Struct.check = (
    value: any = Struct.default(),
    branch: Branch,
    path: Path
  ): [Failure[]?, any?] => {
    const d = Struct.default()

    if (value === undefined) {
      value = d
    }

    if (kindOf(value) !== 'object') {
      return [[Struct.fail({ value, branch, path })]]
    }

    const result = {}
    const failures: Failure[] = []

    for (const k in Props) {
      let v = value[k]
      const p = path.concat(k)
      const b = branch.concat(v)
      const Prop = Props[k]

      if (v === undefined && d != null && k in d) {
        v = typeof d[k] === 'function' ? d[k](value, branch, path) : d[k]
      }

      const [pfs, pr] = Prop.check(v, b, p)

      if (pfs) {
        failures.push(...pfs)
      } else if (pr !== undefined && k in Props) {
        result[k] = pr
      }
    }

    return failures.length ? [failures] : [undefined, result]
  }

  return Struct
}
