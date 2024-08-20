import { assert } from "../../../src";
import { expect, test } from "vitest";
import { integer } from '../../../src'

test("Valid integer", () => {
  const data = 42;
  assert(data, integer());
  expect(data).toStrictEqual(42);
});
