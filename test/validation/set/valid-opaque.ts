import { assert } from "../../../src";
import { expect, test } from "vitest";
import { set } from '../../../src'

test("Valid set opaque", () => {
  const data = new Set(['a', 2, true]);
  assert(data, set());
  expect(data).toStrictEqual(new Set(['a', 2, true]));
});
