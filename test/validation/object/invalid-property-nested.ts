import { validate } from "../../../src";
import { expect, test } from "vitest";
import { object, string } from '../../../src'

test("Invalid object property nested", () => {
  const data = {
    name: 'john',
    address: {
      street: 123,
      city: 'Springfield',
    },
  };

  const [err, res] = validate(data, object({
    name: string(),
    address: object({
      street: string(),
      city: string(),
    }),
  }));

  expect(res).toBeUndefined();

  expect(err).toMatchStructError([
    {
      value: 123,
      type: 'string',
      refinement: undefined,
      path: ['address', 'street'],
      branch: [data, data.address, data.address.street],
    },
  ]);
});
