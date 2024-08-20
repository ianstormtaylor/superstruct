import { validate } from "../../../src";
import { expect, test } from "vitest";
import { object, string, number } from '../../../src'

test("Invalid object property", () => {
  const data = {
    name: 'john',
    age: 'invalid',
    height: 2,
  };

  const [err, res] = validate(data, object({
    name: string(),
    age: number(),
    height: string(),
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
    {
      value: 2,
      type: 'string',
      refinement: undefined,
      path: ['height'],
      branch: [data, data.height],
    },
  ]);
});
