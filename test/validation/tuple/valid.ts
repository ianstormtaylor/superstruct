import { assert } from "../../../src";
import { expect, test } from "vitest";
import { tuple, string, number } from '../../../src'

test("Valid tuple", () => {
  const data = ['A', 1];
  assert(data, tuple([string(), number()]));
  expect(data).toStrictEqual(['A', 1]);
});
