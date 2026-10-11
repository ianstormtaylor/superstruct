import { Describe, assert, enums, literal, object } from '../../src'
import { test } from '..'

test<Describe<'active'>>(() => enums(['active']))
test<Describe<42>>(() => enums([42]))
test<Describe<''>>(() => enums(['']))
test<Describe<0>>(() => enums([0]))

test<Describe<{ state: 'active'; version: 1 }>>(() =>
  object({ state: enums(['active']), version: enums([1]) })
)

test<Describe<'active'>>(() => literal('active'))
test<Describe<42>>(() => literal(42))

test<'active'>((value) => {
  assert(value, enums(['active']))
  return value
})

test<42>((value) => {
  assert(value, enums([42]))
  return value
})

test<Describe<'active'>>(() => {
  // @ts-expect-error An enum with a different value is not assignable.
  const invalid: Describe<'active'> = enums(['inactive'])
  return invalid
})

test<Describe<'active'>>(() => {
  // @ts-expect-error Additional allowed values do not describe a single literal.
  const invalid: Describe<'active'> = enums(['active', 'inactive'])
  return invalid
})

test<Describe<42>>(() => {
  // @ts-expect-error A different numeric literal is not assignable.
  const invalid: Describe<42> = enums([43])
  return invalid
})

test<Describe<42>>(() => {
  // @ts-expect-error String and number literals remain distinct.
  const invalid: Describe<42> = enums(['42'])
  return invalid
})
