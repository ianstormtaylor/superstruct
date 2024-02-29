import { assert, dynamic, string } from '../../src';
import { test } from '../index.test';

test<string>((value) => {
  assert(
    value,
    dynamic(() => string()),
  );
  return value;
});
