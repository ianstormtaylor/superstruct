import { assert } from "../../../src";
import { expect, test } from "vitest";
import { type, string, number, nullable } from '../../../src'

test("Valid nullable defined nested", () => {
  const data = {
    name: 'Jill',
    age: 42,
  };

  assert(data, type({
    name: nullable(string()),
    age: number(),
  }));

  expect(data).toStrictEqual({
    name: 'Jill',
    age: 42,
  });
});
