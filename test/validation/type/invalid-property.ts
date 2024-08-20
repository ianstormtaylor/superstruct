import { validate } from "../../../src";
import { expect, test } from "vitest";
import { type, string, number } from '../../../src'

test("Invalid type property", () => {
  const data = {
    name: 'john',
    age: 'invalid',
  };

  const [err, res] = validate(data, type({
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
