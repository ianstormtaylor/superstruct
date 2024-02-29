import { assert, enums } from '../../src';
import { test } from '../index.test';

test<'a' | 'b' | 'c'>((value) => {
  assert(value, enums(['a', 'b', 'c']));
  return value;
});

test<1 | 2 | 3>((value) => {
  assert(value, enums([1, 2, 3]));
  return value;
});

test<1 | 2 | 3>((value) => {
  assert(value, enums([1, 2, 3] as const));
  return value;
});

test<number>((value) => {
  const values = [1, 2, 3];
  assert(value, enums(values));
  return value;
});

test<{
  a: 'a';
  b: 'b';
  c: 'c';
}>(() => {
  return enums(['a', 'b', 'c']).schema;
});

test<{
  1: 1;
  2: 2;
  3: 3;
}>(() => {
  return enums([1, 2, 3]).schema;
});
