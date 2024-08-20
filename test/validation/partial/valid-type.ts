import { assert } from "../../../src";
import { expect, test } from "vitest";
import { number, partial, string, type } from '../../../src'

test("Valid partial type", () => {
  const data = {
    name: 'john',
    unknownProperty: true,
  };

  assert(data, partial(
    type({
      name: string(),
      age: number(),
    })
  ));

  expect(data).toStrictEqual({
    name: 'john',
    unknownProperty: true,
  });
});
