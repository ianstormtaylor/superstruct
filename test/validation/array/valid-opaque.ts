import { assert } from "../../../src";
import { expect, test } from "vitest";
import { array } from '../../../src'

test("Valid array opaque", () => {
  const data = [1, 'b', true];
  assert(data, array());
  expect(data).toStrictEqual([1, 'b', true]);
});
