/**
 * `Failure` objects represent a specific failure in validation. They are plain
 * objects that can be turned into true `StructError` when needed.
 */

export interface Failure {
  branch: Branch
  path: Path
  value: any
  type: string | null
  reason: string | null
}

/**
 * `Path` arrays specify a nested value's location in a root object or array.
 */

export type Path = Array<number | string>

/**
 * `Branch` arrays contain each value following a path down from the root.
 */

export type Branch = Array<any>

/**
 * `Validator` functions allow developers to define their own types for
 * Superstruct to validate against, and return an indication of what is invalid.
 */

export type Validator = (
  value: any,
  branch: Branch,
  path: Path
) => Partial<Failure>[] | Partial<Failure> | string | boolean

/**
 * `Struct` objects encapsulate the validation logic for a specific type of
 * struct (either custom or built-in) and context for building better errors.
 */

export interface Struct {
  (value: any): any
  kind: string
  type: string
  options: {}
  default(): any
  check(value: any, branch: Branch, path: Path): [Failure[]?, any?]
  assert(value: any): any
  test(value: any): boolean
  validate(value: any): [Error?, any?]
  fail(props: {
    value: any
    branch: Branch
    path: Path
    type?: string | null
    reason?: string | null
  }): Failure
}

/**
 * `StructOptions` are passed in when creating a struct.
 */

export interface StructOptions {
  types: Record<string, Validator>
}

/**
 * `Superstruct` objects are the factories that create different kinds of
 * structs, and encapsulate the user-defined data types.
 */

export interface Superstruct {
  (schema: any, defaults: any, options: {}): Struct
  array(schema: [any], defaults: any, options: {}): Struct
  dynamic(
    schema: (value: any, branch: Branch, path: Path) => Struct,
    defaults: any,
    options: {}
  ): Struct
  enum(schema: any[], defaults: any, options: {}): Struct
  function(schema: Validator, defaults: any, options: {}): Struct
  instance(schema: any, defaults: any, options: {}): Struct
  interface(schema: any, defaults: any, options: {}): Struct
  intersection(schema: any[], defaults: any, options: {}): Struct
  lazy(schema: () => Struct, defaults: any, options: {}): Struct
  literal(schema: any, defaults: any, options: {}): Struct
  object(schema: {}, defaults: any, options: {}): Struct
  optional(schema: any, defaults: any, options: {}): Struct
  pick(schema: {}, defaults: any, options: {}): Struct
  record(schema: [any, any], defaults: any, options: {}): Struct
  scalar(schema: string, defaults: any, options: {}): Struct
  tuple(schema: any[], defaults: any, options: {}): Struct
  union(schema: any[], defaults: any, options: {}): Struct
}

/**
 * `SuperstructOptions` are passed in when creating a superstruct.
 */

export interface SuperstructOptions {
  types?: Record<string, Validator>
}
