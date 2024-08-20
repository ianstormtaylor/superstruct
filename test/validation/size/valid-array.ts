import { assert } from "../../../src";
import { expect, test } from "vitest";
import { number, array, size } from '../../../src'

test("Valid size array", () => {
  const data = [1, 2, 3];
  assert(data, size(array(number()), 1, 5));
  expect(data).toStrictEqual([1, 2, 3]);
});
