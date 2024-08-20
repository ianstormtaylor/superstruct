import { assert } from "../../../src";
import { expect, test } from "vitest";
import { any } from '../../../src'

test("Valid any number", () => {
  const data = 1;
  assert(data, any());
  expect(data).toStrictEqual(1);
});
