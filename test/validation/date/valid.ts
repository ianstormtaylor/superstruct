import { assert } from "../../../src";
import { expect, test } from "vitest";
import { date } from '../../../src'

test("Valid date", () => {
  const data = new Date(0);
  assert(data, date());
  expect(data).toStrictEqual(new Date(0));
});
