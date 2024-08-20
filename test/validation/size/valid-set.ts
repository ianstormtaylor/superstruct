import { assert } from "../../../src";
import { expect, test } from "vitest";
import { number, set, size } from '../../../src'

test("Valid size set", () => {
  const data = new Set([1, 2, 3]);
  assert(data, size(set(number()), 1, 5));
  expect(data).toStrictEqual(data);
});
