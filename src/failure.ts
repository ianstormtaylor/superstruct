/**
 * `StructFailure` objects represent a specific failure in validation. They are
 * used internally for validation and can be turned into real `StructError`
 * objects when necessary.
 */

export class StructFailure {
  branch: Array<any>
  path: Array<string | number>
  type: string
  value: any;
  [key: string]: any

  constructor(props: {
    value: any
    type: string
    branch: Array<any>
    path: Array<string | number>
    [key: string]: any
  }) {
    const { value, type, branch, path, ...rest } = props
    this.value = value
    this.type = type
    this.branch = branch
    this.path = path
    Object.assign(this, rest)
  }
}

/**
 * Wrap every child `StructFailure` in an iterable so that they refer to the
 * same failures but from the context of a parent value.
 */

export function* wrap(
  iterable: Iterable<StructFailure>,
  value: any,
  key: string | number
): Iterable<StructFailure> {
  for (const failure of iterable) {
    failure.path.unshift(key)
    failure.branch.unshift(value)
    yield failure
  }
}
