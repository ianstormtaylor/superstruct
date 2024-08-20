import { assert } from "../../../src";
import { expect, test } from "vitest";
import { string } from '../../../src'

test("Valid string", () => {
  const data = 'valid';
  assert(data, string());
  expect(data).toStrictEqual('valid');
});
