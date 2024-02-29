import { assert, refine, string } from '../../src';
import { test } from '../index.test';

test<string>((value) => {
  assert(
    value,
    refine(string(), 'word', () => true),
  );
  return value;
});
