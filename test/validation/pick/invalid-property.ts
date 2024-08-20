import { validate } from "../../../src";
import { expect, test } from "vitest";
import { pick, object, string, number } from '../../../src'

test("Invalid pick property", () => {
  const data = {
    age: 'invalid',
  };

  const [err, res] = validate(data, pick(
    object({
      name: string(),
      age: number(),
    }),
    ['age']
  ));

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
