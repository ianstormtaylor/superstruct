import { validate } from "../../../src";
import { expect, test } from "vitest";
import { record, string, number } from '../../../src'

test("Invalid record", () => {
  const data = 'invalid';
  const [err, res] = validate(data, record(string(), number()));
  expect(res).toBeUndefined();

  expect(err).toMatchStructError([
    {
      value: 'invalid',
      type: 'record',
      refinement: undefined,
      path: [],
      branch: [data],
    },
  ]);
});
