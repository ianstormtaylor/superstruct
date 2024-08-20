import { validate } from "../../../src";
import { expect, test } from "vitest";
import { assert, type, dynamic, literal, number, string } from '../../../src'

const Entity = type({
  object: string(),
})

const User = type({
  object: literal('USER'),
  username: string(),
})

const Product = type({
  object: literal('PRODUCT'),
  price: number(),
})

const map = {
  USER: User,
  PRODUCT: Product,
}

test("Invalid dynamic reference", () => {
  const data = {
    object: 'PRODUCT',
    price: 'Only $19.99!',
  };

  const [err, res] = validate(data, dynamic((entity) => {
    assert(entity, Entity)
    return map[entity.object]
  }));

  expect(res).toBeUndefined();

  expect(err).toMatchStructError([
    {
      value: 'Only $19.99!',
      type: 'number',
      refinement: undefined,
      path: ['price'],
      branch: [data, data.price],
    },
  ]);
});
