import { validate } from "../../../src";
import { expect, test } from "vitest";
import { dynamic, string } from '../../../src'

test("Invalid dynamic", () => {
  const data = 3;
  const [err, res] = validate(data, dynamic(() => string()));
  expect(res).toBeUndefined();

  expect(err).toMatchStructError([
    {
      value: 3,
      type: 'string',
      refinement: undefined,
      path: [],
      branch: [data],
    },
  ]);
});
