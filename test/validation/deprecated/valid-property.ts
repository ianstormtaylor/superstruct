import { assert } from "../../../src";
import { expect, test } from "vitest";
import { type, number, deprecated, any } from '../../../src'

test("Valid deprecated property", () => {
  const data = {
    age: 42,
  };

  assert(data, type({
    name: deprecated(any(), () => {}),
    age: number(),
  }));

  expect(data).toStrictEqual({
    age: 42,
  });
});
