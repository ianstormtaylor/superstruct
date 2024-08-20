import { assert } from "../../../src";
import { expect, test } from "vitest";
import { number, size } from '../../../src'

test("Valid size number", () => {
  const data = 3;
  assert(data, size(number(), 1, 5));
  expect(data).toStrictEqual(3);
});
