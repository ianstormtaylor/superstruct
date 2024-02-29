import { assert, map, string, number } from '../../src';
import { test } from '../index.test';

test<Map<string, number>>((value) => {
  assert(value, map(string(), number()));
  return value;
});
