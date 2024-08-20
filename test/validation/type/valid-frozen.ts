import { create } from "../../../src";
import { expect, test } from "vitest";
import { type, string, number } from '../../../src'

test("Valid type frozen", () => {
  const data = Object.freeze({
    name: 'john',
    age: 42,
  });

  const res = create(data, type({
    name: string(),
    age: number(),
  }));

  expect(res).toStrictEqual({
    name: 'john',
    age: 42,
  });
});
