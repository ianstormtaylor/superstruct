import { assert } from "../../../src";
import { expect, test } from "vitest";
import { number, optional } from '../../../src'

test("Valid optional defined", () => {
  const data = 42;
  assert(data, optional(number()));
  expect(data).toStrictEqual(42);
});
