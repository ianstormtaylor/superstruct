import invariant from 'tiny-invariant'
import { createStruct } from '../struct'
import {
  Branch,
  Failure,
  Path,
  Struct,
  StructOptions,
  Validator,
} from '../interfaces'

/**
 * Function structs validate their inputs against a validator function.
 */

export const createFunction = (
  schema: Validator,
  defaults: any,
  options: StructOptions
): Struct => {
  const Struct = createStruct({
    kind: 'function',
    type: `function<…>`,
    defaults,
    options,
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
    } else if (typeof result === 'string') {
      failures.push(Struct.fail({ value, branch, path, reason: result }))
    } else if (Array.isArray(result) && result.length > 0) {
      for (const r of result) {
        failures.push(Struct.fail({ value, branch, path, ...r }))
      }
    } else if (typeof result === 'object') {
      failures.push(Struct.fail({ value, branch, path, ...result }))
    } else {
      invariant(
        false,
        `Validator functions must return a boolean, an error reason string or an error reason object, but you passed: ${result}`
      )
    }

    return [failures]
  }

  return Struct
}
