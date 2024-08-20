import { validate } from "../../../src";
import { expect, test } from "vitest";
import { omit, object, string, number } from '../../../src'

test("Invalid omit property unknown", () => {
  const data = {
    name: 'john',
    age: 42,
  };

  const [err, res] = validate(data, omit(
    object({
      name: string(),
      age: number(),
    }),
    ['age']
  ));

  expect(res).toBeUndefined();

  expect(err).toMatchStructError([
    {
      value: 42,
      type: 'never',
      refinement: undefined,
      path: ['age'],
      branch: [data, data.age],
    },
  ]);
});
