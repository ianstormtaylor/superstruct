import { assert, size, string, array, number, map, set } from '../../src';
import { test } from '../index.test';

test<number>((value) => {
  assert(value, size(number(), 1, 5));
  return value;
});

test<string>((value) => {
  assert(value, size(string(), 1, 5));
  return value;
});

test<unknown[]>((value) => {
  assert(value, size(array(), 1, 5));
  return value;
});

test<Set<unknown>>((value) => {
  assert(value, size(set(), 1, 5));
  return value;
});

test<Map<unknown, unknown>>((value) => {
  assert(value, size(map(), 1, 5));
  return value;
});
