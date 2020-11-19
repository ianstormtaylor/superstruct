import { assert, shape, dynamic, literal, number, string } from '../../..'

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
  price: 'Only $19.99!',
}

export const failures = [
  {
    value: 'Only $19.99!',
    type: 'number',
    refinement: undefined,
    path: ['price'],
    branch: [data, data.price],
  },
]
