import invariant from 'tiny-invariant'
import kindOf from 'kind-of'
import { createStruct, Struct, StructOptions } from '../struct'
import { createShorthand } from './'
import { Branch, Failure, Path } from '../struct-error'

export const createRecord = (
  schema: [any, any],
  defaults: any,
  options: StructOptions
): Struct => {
  invariant(
    Array.isArray(schema) && schema.length === 2,
    `Record structs must be defined as an array with two elements, but you passed: ${schema}`
  )

  const Key = createShorthand(schema[0], undefined, options)
  const Value = createShorthand(schema[1], undefined, options)
  const Struct = createStruct({
    kind: 'record',
    type: `record<${Key.type},${Value.type}>`,
    defaults,
    options,
  })

  Struct.check = (
    value: any,
    branch: Branch,
    path: Path
  ): [Failure[]?, any?] => {
    // Record structs have a special default handling behavior, where the defaults
    // are for the entries themselves, not for the entire value. So we can't use
    // JavaScript's built-in default handling here.
    const defs = Struct.default()
    value = defs ? { ...defs, ...value } : value

    if (kindOf(value) !== 'object') {
      return [[Struct.fail({ value, branch, path })]]
    }

    const result = {}
    const failures: Failure[] = []

    for (let k in value) {
      const v = value[k]
      const p = path.concat(k)
      const b = branch.concat(v)
      const [kfs, kr] = Key.check(k, b, p)

      if (kfs) {
        failures.push(...kfs)
      } else {
        const [vfs, vr] = Value.check(v, b, p)

        if (vfs) {
          failures.push(...vfs)
        } else {
          result[kr] = vr
        }
      }
    }

    return failures.length ? [failures] : [undefined, result]
  }

  return Struct
}
