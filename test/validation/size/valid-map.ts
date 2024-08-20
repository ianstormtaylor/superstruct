import { assert } from "../../../src";
import { expect, test } from "vitest";
import { string, number, map, size } from '../../../src'

test("Valid size map", () => {
  const data = new Map([
    [1, 'a'],
    [2, 'b'],
    [3, 'c'],
  ]);

  assert(data, size(map(number(), string()), 1, 5));
  expect(data).toStrictEqual(data);
});
