import { assert, define } from '../../src';
import { test } from '../index.test';

test<string>((value) => {
  assert(
    value,
    define<string>('custom', () => true),
  );
  return value;
});
