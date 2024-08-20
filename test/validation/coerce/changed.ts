import { create } from "../../../src";
import { expect, test } from "vitest";
import { string, unknown, coerce } from '../../../src'

test("Changed coerce", () => {
  const data = null;

  const res = create(data, coerce(string(), unknown(), (x) =>
    x == null ? 'unknown' : x
  ));

  expect(res).toStrictEqual('unknown');
});
