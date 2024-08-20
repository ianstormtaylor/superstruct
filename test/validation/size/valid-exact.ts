import { assert } from "../../../src";
import { expect, test } from "vitest";
import { string, size } from '../../../src'

test("Valid size exact", () => {
  const data = 'abcd';
  assert(data, size(string(), 4));
  expect(data).toStrictEqual('abcd');
});
