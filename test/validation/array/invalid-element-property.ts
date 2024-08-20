import { validate } from "../../../src";
import { expect, test } from "vitest";
import { array, object, string } from '../../../src'

test("Invalid array element property", () => {
  const data = [{ id: '1' }, { id: false }, { id: '3' }];
  const [err, res] = validate(data, array(object({ id: string() })));
  expect(res).toBeUndefined();

  expect(err).toMatchStructError([
    {
      value: false,
      type: 'string',
      refinement: undefined,
      path: [1, 'id'],
      branch: [data, data[1], data[1].id],
    },
  ]);
});
