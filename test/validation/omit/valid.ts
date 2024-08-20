import { assert } from "../../../src";
import { expect, test } from "vitest";
import { omit, object, string, number } from '../../../src'

test("Valid omit", () => {
  const data = {
    name: 'john',
  };

  assert(data, omit(
    object({
      name: string(),
      age: number(),
    }),
    ['age']
  ));

  expect(data).toStrictEqual({
    name: 'john',
  });
});
