import type { Describe } from '../../src';
import {
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
} from '../../src';
import { test } from '../index.test';

test<Describe<any>>(() => {
  return any();
});

test<Describe<string[]>>(() => {
  return array(string());
});

test<Describe<boolean>>(() => {
  return boolean();
});

test<Describe<Date>>(() => {
  return date();
});

test<Describe<string>>(() => {
  return empty(string());
});

test<Describe<'a' | 'b' | 'c'>>(() => {
  return enums(['a', 'b', 'c']);
});

test<Describe<1 | 2 | 3>>(() => {
  return enums([1, 2, 3]);
});

// eslint-disable-next-line @typescript-eslint/ban-types
test<Describe<Function>>(() => {
  return func();
});

test<Describe<number>>(() => {
  return integer();
});

test<Describe<string & number>>(() => {
  return intersection([string(), number()]);
});

test<Describe<false>>(() => {
  return literal(false);
});

test<Describe<42>>(() => {
  return literal(42);
});

test<Describe<'test'>>(() => {
  return literal('test');
});

test<Describe<Map<string, number>>>(() => {
  return map(string(), number());
});

test<Describe<number>>(() => {
  return max(integer(), 0);
});

test<Describe<number>>(() => {
  return min(integer(), 0);
});

test<Describe<never>>(() => {
  return never();
});

test<Describe<string | null>>(() => {
  return nullable(string());
});

test<Describe<number>>(() => {
  return number();
});

test<Describe<{ name: string }>>(() => {
  return object({ name: string() });
});

test<Describe<{ name?: string | undefined }>>(() => {
  return object({ name: optional(string()) });
});

test<Describe<string | undefined>>(() => {
  return optional(string());
});

test<Describe<string>>(() => {
  return pattern(string(), /\d+/u);
});

test<Describe<Record<string, number>>>(() => {
  return record(string(), number());
});

test<Describe<RegExp>>(() => {
  return regexp();
});

test<Describe<Set<number>>>(() => {
  return set(number());
});

test<Describe<string>>(() => {
  return size(string(), 1, 100);
});

test<Describe<string>>(() => {
  return string();
});

test<Describe<[string]>>(() => {
  return tuple([string()]);
});

test<Describe<[string, number]>>(() => {
  return tuple([string(), number()]);
});

test<Describe<string | number>>(() => {
  return union([string(), number()]);
});

test<Describe<unknown>>(() => {
  return unknown();
});
