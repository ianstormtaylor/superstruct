import { validate } from "../../../src";
import { expect, test } from "vitest";
import { dynamic, string, nonempty } from '../../../src'

test("With dynamic refiners", () => {
  const data = '';
  const [err, res] = validate(data, dynamic(() => nonempty(string())));
  expect(res).toBeUndefined();

  expect(err).toMatchStructError([
    {
      value: data,
      type: 'string',
      refinement: 'nonempty',
      path: [],
      branch: [data],
    },
  ]);
});
