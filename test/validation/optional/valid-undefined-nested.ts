import { assert } from "../../../src";
import { expect, test } from "vitest";
import { type, string, number, optional } from '../../../src'

test("Valid optional undefined nested", () => {
  const data = {
    age: 42,
  };

  assert(data, type({
    name: optional(string()),
    age: number(),
  }));

  expect(data).toStrictEqual({
    age: 42,
  });
});
