import {
  Describe,
  any,
  object,
  array,
  string,
  number,
  record,
  date,
  enums,
  tuple,
  never,
  boolean,
  func,
  integer,
  intersection,
  literal,
  map,
  nullable,
  optional,
  regexp,
  size,
  set,
  union,
  unknown,
  empty,
  max,
  min,
  pattern,
} from '../..'
import { test } from '..'

test<Describe<any>>((x) => {
  return any()
})

test<Describe<Array<string>>>((x) => {
  return array(string())
})

test<Describe<boolean>>((x) => {
  return boolean()
})

test<Describe<Date>>((x) => {
  return date()
})

test<Describe<string>>((x) => {
  return empty(string())
})

test<Describe<'a' | 'b' | 'c'>>((x) => {
  return enums(['a', 'b', 'c'])
})

test<Describe<Function>>((x) => {
  return func()
})

test<Describe<number>>((x) => {
  return integer()
})

test<Describe<string & number>>((x) => {
  return intersection([string(), number()])
})

test<Describe<42>>((x) => {
  return literal(42)
})

test<Describe<Map<string, number>>>((x) => {
  return map(string(), number())
})

test<Describe<number>>((x) => {
  return max(integer(), 0)
})

test<Describe<number>>((x) => {
  return min(integer(), 0)
})

test<Describe<never>>((x) => {
  return never()
})

test<Describe<string | null>>((x) => {
  return nullable(string())
})

test<Describe<number>>((x) => {
  return number()
})

test<Describe<{ name: string }>>((x) => {
  return object({ name: string() })
})

test<Describe<{ name?: string }>>((x) => {
  return object({ name: optional(string()) })
})

test<Describe<string | undefined>>((x) => {
  return optional(string())
})

test<Describe<string>>((x) => {
  return pattern(string(), /\d+/)
})

test<Describe<Record<string, number>>>((x) => {
  return record(string(), number())
})

test<Describe<RegExp>>((x) => {
  return regexp()
})

test<Describe<Set<number>>>((x) => {
  return set(number())
})

test<Describe<string>>((x) => {
  return size(string(), 1, 100)
})

test<Describe<string>>((x) => {
  return string()
})

test<Describe<[string]>>((x) => {
  return tuple([string()])
})

test<Describe<[string, number]>>((x) => {
  return tuple([string(), number()])
})

test<Describe<string | number>>((x) => {
  return union([string(), number()])
})

test<Describe<unknown>>((x) => {
  return unknown()
})
