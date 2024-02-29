import { assert, regexp } from '../../src';
import { test } from '../index.test';

test<RegExp>((value) => {
  assert(value, regexp());
  return value;
});
