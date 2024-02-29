import { assert, string, trimmed } from '../../src';
import { test } from '../index.test';

test<string>((value) => {
  assert(value, trimmed(string()));
  return value;
});
