import { assert } from "../../../src";
import { expect, test } from "vitest";
import { omit, object, string } from '../../../src'

test("Valid omit nested", () => {
  const data = {
    address: {
      street: '123 Fake St',
      city: 'Springfield',
    },
  };

  assert(data, omit(
    object({
      name: string(),
      address: object({
        street: string(),
        city: string(),
      }),
    }),
    ['name']
  ));

  expect(data).toStrictEqual({
    address: {
      street: '123 Fake St',
      city: 'Springfield',
    },
  });
});
