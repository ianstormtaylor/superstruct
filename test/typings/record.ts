import { assert, record, string, number } from '../../src';
import { test } from '../index.test';

test<Record<string, number>>((value) => {
  assert(value, record(string(), number()));
  return value;
});
