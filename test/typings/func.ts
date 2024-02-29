import { assert, func } from '../../src';
import { test } from '../index.test';

// eslint-disable-next-line @typescript-eslint/ban-types
test<Function>((value) => {
  assert(value, func());
  return value;
});
