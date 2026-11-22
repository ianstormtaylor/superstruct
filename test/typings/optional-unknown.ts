import {
  any,
  Infer,
  object,
  optional,
  partial,
  string,
  type,
  unknown,
} from '../../src'
import { test } from '..'

const ObjectStruct = object({
  foo: optional(string()),
  baz: optional(unknown()),
})

test<Infer<typeof ObjectStruct>>(() => ({}))

const TypeStruct = type({
  foo: optional(string()),
  baz: optional(unknown()),
})

test<Infer<typeof TypeStruct>>(() => ({}))

const PartialObjectStruct = partial(object({ baz: unknown() }))
const PartialTypeStruct = partial(type({ baz: unknown() }))

test<Infer<typeof PartialObjectStruct>>(() => ({}))
test<Infer<typeof PartialTypeStruct>>(() => ({}))

// Both unknown() and any() accept undefined, even without optional().
const UnknownStruct = object({ baz: unknown(), other: any() })

test<Infer<typeof UnknownStruct>>(() => ({}))

const RequiredStruct = object({ required: string(), baz: optional(unknown()) })

test<Infer<typeof RequiredStruct>>(() => ({ required: 'value' }))

test<Infer<typeof RequiredStruct>>(() => {
  // @ts-expect-error The string property must still be required.
  const value: Infer<typeof RequiredStruct> = {}
  return value
})

test<Infer<typeof ObjectStruct>>(() => ({ foo: 'value', baz: null }))
test<Infer<typeof ObjectStruct>>(() => ({ baz: { nested: true } }))
