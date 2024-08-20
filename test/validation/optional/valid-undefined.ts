import { assert } from "../../../src";
import { expect, test } from "vitest";
import { number, optional } from '../../../src'

test("Valid optional undefined", () => {
  const data = undefined;
  assert(data, optional(number()));
  expect(data).toStrictEqual(undefined);
});
