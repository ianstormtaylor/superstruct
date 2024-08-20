import { assert } from "../../../src";
import { expect, test } from "vitest";
import { deprecated, number } from '../../../src'

test("Valid deprecated", () => {
  const data = 42;
  assert(data, deprecated(number(), () => {}));
  expect(data).toStrictEqual(42);
});
