import { create } from "../../../src";
import { expect, test } from "vitest";
import { object, string, number } from '../../../src'

test("Valid object frozen", () => {
  const data = Object.freeze({
    name: 'john',
    age: 42,
  });

  const res = create(data, object({
    name: string(),
    age: number(),
  }));

  expect(res).toStrictEqual({
    name: 'john',
    age: 42,
  });
});
