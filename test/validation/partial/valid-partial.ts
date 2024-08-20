import { assert } from "../../../src";
import { expect, test } from "vitest";
import { partial, string, number } from '../../../src'

test("Valid partial partial", () => {
  const data = {
    name: 'john',
  };

  assert(data, partial({
    name: string(),
    age: number(),
  }));

  expect(data).toStrictEqual({
    name: 'john',
  });
});
