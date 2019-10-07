import { StructError } from './error'
import { superstruct } from './superstruct'
import { isStruct } from './struct'

const struct = superstruct()

export { struct, superstruct, isStruct, StructError }
