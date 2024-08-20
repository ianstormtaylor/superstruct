import { create } from "../../../src";
import { expect, test } from "vitest";
import { string, trimmed } from '../../../src'

test("Valid trimmed", () => {
  const data = '  valid  ';
  const res = create(data, trimmed(string()));
  expect(res).toStrictEqual('valid');
});
