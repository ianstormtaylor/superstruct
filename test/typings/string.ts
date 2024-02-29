import { assert, string } from '../../src';
import { test } from '../index.test';

test<string>((value) => {
  assert(value, string());
  return value;
});
