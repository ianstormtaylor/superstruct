import { assert } from "../../../src";
import { expect, test } from "vitest";
import { enums } from '../../../src'

test("Valid enums", () => {
  const data = 'two';
  assert(data, enums(['one', 'two']));
  expect(data).toStrictEqual('two');
});
