import { expect, test } from 'vitest'
import { data, fixtures } from './fixtures'

test('Test that picking fixtures works as expected', () => {
  const expected = [...data.integers(), ...data.strings(), ...data.functions()]

  const actual = fixtures.pick(['integers', 'strings', 'functions'])

  expect(JSON.stringify(actual)).toStrictEqual(JSON.stringify(expected))
})

test('Test that omitting fixtures works as expected', () => {
  const expected = [
    ...data.booleans(),
    ...data.functions(),
    ...data.nulls(),
    ...data.undefineds(),
    ...data.nan(),
    ...data.floats(),
  ]

  const actual = fixtures.omit(['integers', 'strings'])

  expect(JSON.stringify(actual)).toStrictEqual(JSON.stringify(expected))
})
