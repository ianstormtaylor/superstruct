import { Struct, StructResult, StructFailure, StructContext } from './struct'

export type StructRecord<T> = Record<string, Struct<T>>
export type StructTuple<T> = { [K in keyof T]: Struct<T[K]> }

/**
 * Convert a validation result to an iterable of failures.
 */

export function* toFailures(
  result: StructResult,
  context: StructContext
): IterableIterator<StructFailure> {
  if (result === true) {
    // yield nothing
  } else if (result === false) {
    yield context.fail()
  } else {
    yield* result
  }
}

/**
 * Shifts (removes and returns) the first value from the `input` iterator.
 * Like `Array.prototype.shift()` but for an `Iterator`.
 */

export function iteratorShift<T>(input: Iterator<T>): T | undefined {
  const { done, value } = input.next()
  return done ? undefined : value
}
