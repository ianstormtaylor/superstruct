import { assert } from "../../../src";
import { expect, test } from "vitest";
import { set, number } from '../../../src'

test("Valid set", () => {
  const data = new Set([1, 2, 3]);
  assert(data, set(number()));
  expect(data).toStrictEqual(new Set([1, 2, 3]));
});
