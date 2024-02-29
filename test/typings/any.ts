import { assert, any } from '../../src';
import { test } from '../index.test';

test<any>((value) => {
  assert(value, any());
  return value;
});
