import { assert } from "../../../src";
import { expect, test } from "vitest";
import { unknown } from '../../../src'

test("Valid unknown undefined", () => {
  const data = undefined;
  assert(data, unknown());
  expect(data).toStrictEqual(undefined);
});
