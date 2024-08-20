import { validate } from "../../../src";
import { expect, test } from "vitest";
import { partial, string, number } from '../../../src'

test("Invalid partial property", () => {
  const data = {
    age: 'invalid',
  };

  const [err, res] = validate(data, partial({
    name: string(),
    age: number(),
  }));

  expect(res).toBeUndefined();

  expect(err).toMatchStructError([
    {
      value: 'invalid',
      type: 'number',
      refinement: undefined,
      path: ['age'],
      branch: [data, data.age],
    },
  ]);
});
