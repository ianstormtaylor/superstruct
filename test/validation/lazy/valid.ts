import { assert } from "../../../src";
import { expect, test } from "vitest";
import { lazy, string } from '../../../src'

test("Valid lazy", () => {
  const data = 'two';
  assert(data, lazy(() => string()));
  expect(data).toStrictEqual('two');
});
