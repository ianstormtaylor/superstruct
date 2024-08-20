import { assert } from "../../../src";
import { expect, test } from "vitest";
import { number, min } from '../../../src'

test("Valid min inclusive", () => {
  const data = 0;
  assert(data, min(number(), 0));
  expect(data).toStrictEqual(0);
});
