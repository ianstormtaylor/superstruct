import { assert } from "../../../src";
import { expect, test } from "vitest";
import { string, refine } from '../../../src'

test("Valid refine", () => {
  const data = 'name@example.com';
  assert(data, refine(string(), 'email', (value) => value.includes('@')));
  expect(data).toStrictEqual('name@example.com');
});
