import { assert, type, dynamic, literal, number, string } from '../../..'

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

export const Struct = dynamic((entity) => {
  assert(entity, Entity)
  return map[entity.object]
})

export const data = {
  object: 'PRODUCT',
  price: 'Only $19.99!',
}

export const failures = [
  {
    value: 'Only $19.99!',
    type: 'number',
    path: ['price'],
    branch: [data, data.price],
  },
]
