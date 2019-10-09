import invariant from 'tiny-invariant'
import kindOf from 'kind-of'
import { Branch, Failure, Path, Struct, Superstruct } from '..'
import { createStruct } from '../struct'

export const createPartial = (
  schema: {},
  defaults: any,
  struct: Superstruct
): Struct => {
  invariant(
    typeof schema === 'object',
    `Partial structs must be defined as an object, but you passed: ${schema}`
  )

  const Props: Record<string, Struct> = {}

  for (const key in schema) {
    Props[key] = struct.union([schema[key], 'undefined'])
  }

  const Struct = createStruct({
    kind: 'object',
    type: `{${Object.keys(schema).join()}}`,
    defaults,
    struct,
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

    for (const k of value) {
      let v = value[k]
      const p = path.concat(k)
      const b = branch.concat(v)
      const Prop = Props[k]

      if (v === undefined && d != null && k in d) {
        v = typeof d[k] === 'function' ? d[k](value, branch, path) : d[k]
      }

      if (!(k in Props)) {
        failures.push(
          Struct.fail({
            type: undefined,
            value: v,
            path: p,
            branch: value,
          })
        )

        continue
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
