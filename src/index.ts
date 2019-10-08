import { StructError, Failure, Path, Branch } from './struct-error'
import { Validator } from './validators'
import { isStruct, Struct } from './struct'
import { superstruct } from './superstruct'

const struct = superstruct()

export {
  Branch,
  Failure,
  Path,
  Struct,
  StructError,
  Validator,
  isStruct,
  struct,
  superstruct,
}
