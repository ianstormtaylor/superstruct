import { assert, boolean } from '../../src';
import { test } from '../index.test';

test<boolean>((value) => {
  assert(value, boolean());
  return value;
});
