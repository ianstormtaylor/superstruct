import { assert } from "../../../src";
import { expect, test } from "vitest";
import { record, string, number } from '../../../src'

test("Valid record", () => {
  const data = {
    a: 1,
    b: 2,
  };

  assert(data, record(string(), number()));

  expect(data).toStrictEqual({
    a: 1,
    b: 2,
  });
});
