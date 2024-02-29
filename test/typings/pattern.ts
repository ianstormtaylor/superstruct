import { assert, pattern, string } from '../../src';
import { test } from '../index.test';

test<string>((value) => {
  assert(value, pattern(string(), /.*/u));
  return value;
});
