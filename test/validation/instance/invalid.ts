import { validate } from "../../../src";
import { expect, test } from "vitest";
import { instance } from '../../../src'

test("Invalid instance", () => {
  const data = false;
  const [err, res] = validate(data, instance(Array));
  expect(res).toBeUndefined();

  expect(err).toMatchStructError([
    {
      value: false,
      type: 'instance',
      refinement: undefined,
      path: [],
      branch: [data],
    },
  ]);
});
