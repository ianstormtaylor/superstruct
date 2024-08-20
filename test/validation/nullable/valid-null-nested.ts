import { assert } from "../../../src";
import { expect, test } from "vitest";
import { type, string, number, nullable } from '../../../src'

test("Valid nullable null nested", () => {
  const data = {
    name: null,
    age: 42,
  };

  assert(data, type({
    name: nullable(string()),
    age: number(),
  }));

  expect(data).toStrictEqual({
    name: null,
    age: 42,
  });
});
