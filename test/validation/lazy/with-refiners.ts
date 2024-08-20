import { validate } from "../../../src";
import { expect, test } from "vitest";
import { lazy, nonempty, string } from '../../../src'

test("With lazy refiners", () => {
  const data = '';
  const [err, res] = validate(data, lazy(() => nonempty(string())));
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
