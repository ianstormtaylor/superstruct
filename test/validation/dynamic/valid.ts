import { assert } from "../../../src";
import { expect, test } from "vitest";
import { dynamic, string } from '../../../src'

test("Valid dynamic", () => {
  const data = 'valid';
  assert(data, dynamic(() => string()));
  expect(data).toStrictEqual('valid');
});
