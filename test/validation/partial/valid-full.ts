import { assert } from "../../../src";
import { expect, test } from "vitest";
import { partial, string, number } from '../../../src'

test("Valid partial full", () => {
  const data = {
    name: 'john',
    age: 42,
  };

  assert(data, partial({
    name: string(),
    age: number(),
  }));

  expect(data).toStrictEqual({
    name: 'john',
    age: 42,
  });
});
