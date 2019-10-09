import invariant from 'tiny-invariant'
import { Branch, Failure, Path, Struct, Superstruct, Validator } from '..'
import { createStruct } from '../struct'

export const createFunction = (
  schema: Validator,
  defaults: any,
  struct: Superstruct
): Struct => {
  const Struct = createStruct({
    kind: 'function',
    type: `function<…>`,
    defaults,
    struct,
  })

  Struct.check = (
    value: any = Struct.default(),
    branch: Branch,
    path: Path
  ): [Failure[]?, any?] => {
    const result = schema(value, branch, path)

    if (result === true) {
      return [undefined, value]
    }

    const failures: Failure[] = []

    if (result === false) {
      failures.push(Struct.fail({ value, branch, path }))
    } else if (Array.isArray(result) && result.length > 0) {
      for (const r of result) {
        failures.push(Struct.fail({ value, branch, path, ...r }))
      }
    } else if (typeof result === 'object') {
      failures.push(Struct.fail({ value, branch, path, ...result }))
    } else {
      invariant(
        false,
        `Validator functions must return a boolean, a failure object, or an array of failure objects, but you passed: ${result}`
      )
    }

    return [failures]
  }

  return Struct
}
