import { assert, nonempty, string, array, map, set } from '../../src';
import { test } from '../index.test';

test<string>((value) => {
  assert(value, nonempty(string()));
  return value;
});

test<unknown[]>((value) => {
  assert(value, nonempty(array()));
  return value;
});

test<Set<unknown>>((value) => {
  assert(value, nonempty(set()));
  return value;
});

test<Map<unknown, unknown>>((value) => {
  assert(value, nonempty(map()));
  return value;
});
