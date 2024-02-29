import { assert, defaulted, string } from '../../src';
import { test } from '../index.test';

test<string>((value) => {
  assert(value, defaulted(string(), 'Untitled'));
  return value;
});
