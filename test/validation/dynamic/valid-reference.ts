import { assert, shape, dynamic, literal, string, number } from '../../..'

const Entity = shape({
  object: string(),
})

const User = shape({
  object: literal('USER'),
  username: string(),
})

const Product = shape({
  object: literal('PRODUCT'),
  price: number(),
})

const map = {
  USER: User,
  PRODUCT: Product,
}

export const Struct = dynamic((entity) => {
  assert(entity, Entity)
  return map[entity.object]
})

export const data = {
  object: 'PRODUCT',
  price: 1999,
}

export const output = {
  object: 'PRODUCT',
  price: 1999,
}
