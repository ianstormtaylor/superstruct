import { assert } from "../../../src";
import { expect, test } from "vitest";
import { number, nullable } from '../../../src'

test("Valid nullable defined", () => {
  const data = 42;
  assert(data, nullable(number()));
  expect(data).toStrictEqual(42);
});
