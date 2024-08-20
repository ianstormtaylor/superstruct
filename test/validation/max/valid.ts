import { assert } from "../../../src";
import { expect, test } from "vitest";
import { number, max } from '../../../src'

test("Valid max", () => {
  const data = -1;
  assert(data, max(number(), 0));
  expect(data).toStrictEqual(-1);
});
