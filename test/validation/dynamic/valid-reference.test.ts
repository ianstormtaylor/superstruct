import { assert } from '../../../src'
import { expect, test } from 'vitest'
import { assert, type, dynamic, literal, string, number } from '../../../src'

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

test('Valid dynamic reference', () => {
  const data = {
    object: 'PRODUCT',
    price: 1999,
  }

  assert(
    data,
    dynamic((entity) => {
      assert(entity, Entity)
      return map[entity.object]
    })
  )

  expect(data).toStrictEqual({
    object: 'PRODUCT',
    price: 1999,
  })
})
