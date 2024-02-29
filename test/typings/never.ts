import { assert, never } from '../../src';
import { test } from '../index.test';

test<never>((value) => {
  assert(value, never());
  return value;
});
